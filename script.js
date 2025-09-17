// Получение элементов
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');
const modalClose = document.querySelector('.modal__close');
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
let lastActive = null;

// Установка активного пункта меню
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.site-nav__link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('site-nav__link--active');
        }
    });
}

// Применение темы
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('theme-dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('theme-dark');
        localStorage.setItem('theme', 'light');
    }
}

// переключение темы
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        applyTheme('dark');
    }
}

// Телефонная маска
function applyPhoneMask(input) {
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    let formattedValue = '';
    
    if (digits.length > 0) {
        // Замена на +7 в начале
        let cleanDigits = digits;
        if (cleanDigits.startsWith('8')) {
            cleanDigits = '7' + cleanDigits.slice(1);
        } else if (cleanDigits.startsWith('7')) {
        } else {
            cleanDigits = '7' + cleanDigits;
        }
        
        // Форматирование номера
        if (cleanDigits.length > 0) formattedValue += '+7';
        if (cleanDigits.length > 1) formattedValue += ` (${cleanDigits.slice(1, 4)}`;
        if (cleanDigits.length >= 4) formattedValue += ')';
        if (cleanDigits.length >= 5) formattedValue += ` ${cleanDigits.slice(4, 7)}`;
        if (cleanDigits.length >= 8) formattedValue += `-${cleanDigits.slice(7, 9)}`;
        if (cleanDigits.length >= 10) formattedValue += `-${cleanDigits.slice(9, 11)}`;
    }
    
    input.value = formattedValue;
}

// Обработчик ввода для телефона
phoneInput?.addEventListener('input', (e) => {
    // Сохранение позиции курсора
    const cursorPosition = e.target.selectionStart;
    
    applyPhoneMask(e.target);
    
    // Восстановление позиции курсора
    const newCursorPosition = cursorPosition + (e.target.value.length - e.target.getAttribute('data-prev-length'));
    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    e.target.setAttribute('data-prev-length', e.target.value.length);
});

phoneInput?.addEventListener('focus', (e) => {
    e.target.setAttribute('data-prev-length', e.target.value.length);
    if (!e.target.value) {
        e.target.value = '+7 (';
    }
});

openBtn?.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn?.addEventListener('click', () => {
    dlg.close('cancel');
    form.reset();
});

modalClose?.addEventListener('click', () => {
    dlg.close('cancel');
    form.reset();
});

// Обработка отправки формы
form?.addEventListener('submit', (e) => {
    Array.from(form.elements).forEach(el => {
        if (el.setCustomValidity) {
            el.setCustomValidity('');
        }
        el.removeAttribute('aria-invalid');
    });

    if (!form.checkValidity()) {
        e.preventDefault();
        
        // Ошибки
        const email = form.elements.email;
        if (email && email.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        
        const phone = form.elements.phone;
        if (phone && phone.validity.patternMismatch) {
            phone.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
        }
        
        const message = form.elements.message;
        if (message && message.validity.tooShort) {
            message.setCustomValidity('Сообщение должно содержать минимум 10 символов');
        }
        
        form.reportValidity();
        
        // Пометка проблемных полей
        Array.from(form.elements).forEach(el => {
            if (el.willValidate && !el.checkValidity()) {
                el.setAttribute('aria-invalid', 'true');
            }
        });
        
        return;
    }

    e.preventDefault();
    
    dlg.close('success');
    form.reset();
    
    window.location.href = 'thankyou.html';
});

// Возвращение фокуса после модалки
dlg?.addEventListener('close', () => {
    lastActive?.focus();
});

// Закрытие по клику на подложку
dlg?.addEventListener('click', (e) => {
    if (e.target === dlg) {
        dlg.close('cancel');
        form.reset();
    }
});

// Обработчик переключения темы
themeToggle?.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    setActiveNavItem();
    initTheme(); // Инициализируем тему
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});