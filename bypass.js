(function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(r => r.unregister());
        });
    }
    
    const origFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && (url.includes('sniff_domain_list') || url.includes('alive.php'))) {
            return Promise.reject(new Error('Blocked'));
        }
        return origFetch.apply(this, args);
    };
    
    if (window.turnstile) {
        window.turnstile.render = function() {
            window.captchasolved = true;
            return 'widget_ok';
        };
        window.turnstile.reset = function() {
            window.captchasolved = true;
        };
    }
    
    Object.defineProperty(window, 'turnstile', {
        get: function() {
            return {
                render: function() { window.captchasolved = true; return 'ok'; },
                reset: function() { window.captchasolved = true; },
                remove: function() {},
                getResponse: function() { return 'complete'; }
            };
        },
        set: function() {}
    });
    
    window.initCloudflare = function() {
        window.captchasolved = true;
        window.altcapopen = false;
        $('#myWidget').hide();
        $('.container').show();
        $('#changeImageButton').show();
    };
    
    window.captchasolved = true;
    window.hwidImage = 'img_' + Date.now();
    window.currentAngle = 0;
    window.altcapopen = false;
    
    window.reloadCaptcha = function() {
        window.captchasolved = true;
        const slider = document.getElementById('rotationSlider');
        if (slider) {
            slider.value = 0;
            slider.disabled = true;
        }
        const btn = document.querySelector('.butonlogreg');
        if (btn) {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    };
    
    window.reloadImage = window.reloadCaptcha;
    
    const origRegister = window.register;
    window.register = function() {
        window.captchasolved = true;
        window.hwidImage = window.hwidImage || 'reg_' + Date.now();
        window.currentAngle = 0;
        
        const token = 'tok_' + Math.random().toString(36).substr(2, 15);
        let cfInput = document.querySelector('input[name="cf-turnstile-response"]');
        if (!cfInput) {
            cfInput = document.createElement('input');
            cfInput.type = 'hidden';
            cfInput.name = 'cf-turnstile-response';
            document.body.appendChild(cfInput);
        }
        cfInput.value = token;
        
        const slider = document.getElementById('rotationSlider');
        if (slider) {
            slider.disabled = true;
            slider.value = 0;
        }
        
        const btn = document.querySelector('.butonlogreg');
        if (btn) {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
        
        return origRegister.apply(this, arguments);
    };
    
    const origLogin = window.login;
    window.login = function() {
        window.captchasolved = true;
        window.hwidImage = window.hwidImage || 'login_' + Date.now();
        window.currentAngle = 0;
        return origLogin.apply(this, arguments);
    };
    
    setTimeout(() => {
        document.querySelectorAll('.cf-icon-exclamation-sign, .cf-btn-danger, .cf-turnstile').forEach(el => el.remove());
        
        const slider = document.getElementById('rotationSlider');
        if (slider) {
            slider.disabled = true;
            slider.value = 0;
        }
        
        const btn = document.querySelector('.butonlogreg');
        if (btn) {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    }, 500);
    
    setInterval(() => {
        if (!window.captchasolved) window.captchasolved = true;
        if (!window.hwidImage) window.hwidImage = 'check_' + Date.now();
        if (window.altcapopen === true) {
            window.altcapopen = false;
            $('#myWidget').hide();
            $('.container').show();
        }
        const slider = document.getElementById('rotationSlider');
        if (slider && !slider.disabled) {
            slider.disabled = true;
            slider.value = 0;
        }
        const btn = document.querySelector('.butonlogreg');
        if (btn && btn.style.pointerEvents !== 'auto') {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    }, 200);
    
    setTimeout(() => {
        if (window.captchasolved) {
            const indicator = document.createElement('div');
            indicator.innerText = 'Captcha Bypass Active';
            indicator.style.cssText = 'position:fixed;bottom:20px;left:20px;color:#0f0;font-family:monospace;font-size:14px;z-index:9999;';
            document.body.appendChild(indicator);
        }
    }, 800);
})();