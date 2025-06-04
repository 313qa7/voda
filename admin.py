# ملف إدارة الموقع - VF NoTAX
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import json
import os
from datetime import datetime

# إنشاء Blueprint للأدمن
admin_bp = Blueprint('admin', __name__)

# ملف بيانات الأدمن
ADMIN_DATA_FILE = 'admin_data.json'

def init_admin_file():
    """إنشاء ملف بيانات الأدمن إذا لم يكن موجودًا"""
    if not os.path.exists(ADMIN_DATA_FILE):
        default_data = {
            "username": "admin",
            "password": "vf2024@admin",
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        with open(ADMIN_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)

def load_admin_data():
    """تحميل بيانات الأدمن"""
    try:
        with open(ADMIN_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        init_admin_file()
        return load_admin_data()

def save_admin_data(data):
    """حفظ بيانات الأدمن"""
    with open(ADMIN_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """صفحة تسجيل دخول الأدمن"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        admin_data = load_admin_data()
        
        if username == admin_data['username'] and password == admin_data['password']:
            session['admin_logged_in'] = True
            session['admin_username'] = username
            
            # تحديث وقت آخر دخول
            admin_data['last_login'] = datetime.now().isoformat()
            save_admin_data(admin_data)
            
            flash('تم تسجيل الدخول بنجاح', 'success')
            return redirect(url_for('orders'))
        else:
            flash('اسم المستخدم أو كلمة المرور غير صحيحة', 'danger')
    
    return render_template('admin/login.html')

@admin_bp.route('/logout')
def logout():
    """تسجيل خروج الأدمن"""
    session.pop('admin_logged_in', None)
    session.pop('admin_username', None)
    flash('تم تسجيل الخروج بنجاح', 'info')
    return redirect(url_for('index'))

@admin_bp.route('/dashboard')
def dashboard():
    """لوحة تحكم الأدمن"""
    if 'admin_logged_in' not in session or not session['admin_logged_in']:
        flash('لازم تسجل دخول الأول', 'danger')
        return redirect(url_for('admin.login'))
    
    # إحصائيات بسيطة
    from app import Order
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status='pending').count()
    completed_orders = Order.query.filter_by(status='completed').count()
    
    stats = {
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'completed_orders': completed_orders
    }
    
    return render_template('admin/dashboard.html', stats=stats)

def require_admin_login(f):
    """ديكوريتر للتحقق من تسجيل دخول الأدمن"""
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session or not session['admin_logged_in']:
            flash('لازم تسجل دخول الأول', 'danger')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function
