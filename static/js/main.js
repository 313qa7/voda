// ملف JavaScript الرئيسي لموقع VF - NoTAX

// تحسين أداء JavaScript - استخدام DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // للتأكد من تحميل الصفحة

    var form = document.getElementById('balanceForm');
    var calculateBtn = document.getElementById('calculateBtn');
    var inputField = document.getElementById('net_balance');

    console.log('Form:', form, 'Button:', calculateBtn, 'Input:', inputField); // للتشخيص

    if (inputField) {
        // تحسين للأجهزة اللمسية
        inputField.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // إضافة دعم للمس
        inputField.addEventListener('touchstart', function(e) {
            this.focus();
        });
    }

    // إضافة event listener للزر مباشرة أيضاً
    if (calculateBtn) {
        // منع الـ double tap zoom على iOS
        calculateBtn.style.touchAction = 'manipulation';

        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked'); // للتشخيص
            calculatePrice();
        });

        // دعم اللمس للزر مع منع التكرار
        let touchTimeout;
        calculateBtn.addEventListener('touchstart', function(e) {
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(function() {
                e.preventDefault();
                console.log('Button touched'); // للتشخيص
                calculatePrice();
            }, 100);
        });

        calculateBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted'); // للتشخيص
            calculatePrice();
        });
    }

    function calculatePrice() {
        console.log('Calculate function called'); // للتشخيص

        var value = parseInt(inputField.value);
        console.log('Input value:', value); // للتشخيص

        if (isNaN(value) || value < 20) {
            alert('معلش، أقل رصيد ممكن تشحنه هو 20 جنيه!');
            return false;
        }

        // حساب التكلفة مع الضرائب (43% ضرائب فودافون)
        const netBalance = value;
        const totalVodafone = Math.round(netBalance * 1.43); // سعر فودافون مع الضرائب
        const totalBot = Math.round(netBalance * 1.22); // سعرنا (22% زيادة)
        const savings = totalVodafone - totalBot;

        console.log('Calculations:', {netBalance, totalVodafone, totalBot, savings}); // للتشخيص

        // إنشاء عنصر المقارنة
        const comparisonHTML = `
            <div class="price-comparison">
                <h3>مقارنة الأسعار:</h3>
                <div class="price-item">
                    <span class="price-label">الرصيد اللي طلبته:</span>
                    <span class="price-value">${netBalance} ج</span>
                </div>
                <div class="price-item">
                    <span class="price-label">سعره عند فودافون:</span>
                    <span class="price-value">${totalVodafone} ج</span>
                </div>
                <div class="price-item highlight">
                    <span class="price-label">سعره عندنا:</span>
                    <span class="price-value">${totalBot} ج</span>
                </div>
                <div class="price-item">
                    <span class="price-label">هتوفر:</span>
                    <span class="price-value">${savings} ج</span>
                </div>
            </div>
            <div class="telegram-contact">
                <div class="contact-header">
                    <h4>تواصل معنا لإتمام الطلب</h4>
                </div>
                <a href="https://t.me/voda2468" target="_blank" class="telegram-btn">
                    <i class="bi bi-telegram me-2"></i>
                    تواصل عبر التليجرام
                </a>
                <a href="https://wa.me/201006311569?text=السلام عليكم، شحن رصيد فودافون بقيمة ${netBalance} جنيه بسعر ${totalBot} جنيه" target="_blank" class="whatsapp-btn">
                    <i class="bi bi-whatsapp me-2"></i>
                    تواصل عبر الواتساب
                </a>
                <p class="contact-note">اضغط على الرابط وابعت تفاصيل طلبك</p>
            </div>
        `;

        // البحث عن مكان عرض المقارنة أو إنشاؤه
        let comparisonContainer = document.getElementById('price-comparison-container');
        if (!comparisonContainer) {
            comparisonContainer = document.createElement('div');
            comparisonContainer.id = 'price-comparison-container';
            const cardBody = document.querySelector('.balance-card .card-body');
            if (cardBody) {
                cardBody.appendChild(comparisonContainer);
            } else {
                // fallback إذا لم يجد card-body
                document.querySelector('.balance-card').appendChild(comparisonContainer);
            }
        }

        comparisonContainer.innerHTML = comparisonHTML;
        console.log('Comparison added'); // للتشخيص

        // تمرير سلس للمقارنة مع تأخير بسيط
        setTimeout(function() {
            comparisonContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }

    // إضافة تأثيرات تفاعلية إضافية
    addInteractiveEffects();
});

// وظائف التأثيرات التفاعلية
function addInteractiveEffects() {
    // تأثير hover للبطاقات
    const cards = document.querySelectorAll('.balance-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1.02)';
        });
    });

    // تأثير النقر للأزرار
    const buttons = document.querySelectorAll('.balance-button, .telegram-btn, .whatsapp-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // تأثير التركيز للحقول
    const inputs = document.querySelectorAll('.balance-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = '';
        });
    });
}

// وظيفة لإضافة تأثيرات الانيميشن
function addAnimationEffects() {
    // انيميشن ظهور العناصر عند التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // مراقبة العناصر
    const elementsToAnimate = document.querySelectorAll('.balance-card, .alert, .price-comparison');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// تشغيل تأثيرات الانيميشن عند تحميل الصفحة
window.addEventListener('load', addAnimationEffects);

// وظيفة لتحسين الأداء على الموبايل
function optimizeForMobile() {
    // تحسين اللمس
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // منع الزوم المزدوج
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// تشغيل تحسينات الموبايل
optimizeForMobile();

// وظيفة لحفظ البيانات محلياً
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// وظيفة لاسترجاع البيانات المحفوظة
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.log('LocalStorage not available');
        return null;
    }
}

// حفظ آخر قيمة مدخلة
document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.getElementById('net_balance');
    if (inputField) {
        // استرجاع آخر قيمة
        const lastValue = getFromLocalStorage('lastBalance');
        if (lastValue) {
            inputField.value = lastValue;
        }
        
        // حفظ القيمة عند التغيير
        inputField.addEventListener('input', function() {
            saveToLocalStorage('lastBalance', this.value);
        });
    }
});







// Lazy loading للصور
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    if (src) {
                        img.src = src;
                        img.classList.remove('lazy-load');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback للمتصفحات القديمة
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.remove('lazy-load');
                img.classList.add('loaded');
            }
        });
    }
}

// تشغيل lazy loading عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initLazyLoading);
