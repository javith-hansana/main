document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('night-mode');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('night-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('night-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');

    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when clicking on a link or outside
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
            const isClickInsideMenu = navMenu.contains(e.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnMenuBtn) {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    });

    // Toggle Password Visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Form Navigation
    const signinForm = document.getElementById('signinForm');
    const otpForm = document.getElementById('otpForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordVerifyForm = document.getElementById('forgotPasswordVerifyForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const backToSignIn = document.getElementById('backToSignIn');
    const backToForgotPassword = document.getElementById('backToForgotPassword');
    const useDifferentMethod = document.getElementById('useDifferentMethod');
    const userEmail = document.getElementById('userEmail');

    // Forgot Password Link
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        signinForm.style.display = 'none';
        forgotPasswordForm.style.display = 'flex';
    });

    // Back to Sign In from Forgot Password
    backToSignIn.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordForm.style.display = 'none';
        signinForm.style.display = 'flex';
    });

    // Back to Forgot Password from Verification
    backToForgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordVerifyForm.style.display = 'none';
        forgotPasswordForm.style.display = 'flex';
    });

    // Use Different Method Link
    useDifferentMethod.addEventListener('click', function(e) {
        e.preventDefault();
        otpForm.style.display = 'none';
        signinForm.style.display = 'flex';
    });

    // Sign In Form Submission
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // In a real application, you would validate credentials with your server
        // For this demo, we'll simulate a successful login with OTP verification
        
        // Show OTP form
        signinForm.style.display = 'none';
        otpForm.style.display = 'flex';
        
        // Set the email in the OTP message
        userEmail.textContent = username.includes('@') ? username : `${username}@jhfiletransfer.com`;
        
        // Simulate sending OTP
        setTimeout(() => {
            alert('A 6-digit verification code has been sent to your email');
        }, 1000);
    });

    // OTP Form Submission
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would verify the OTP with your server
        // For this demo, we'll simulate successful verification
        
        alert('Verification successful! Redirecting to your dashboard...');
        // window.location.href = 'dashboard.html';
    });

    // Forgot Password Form Submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        const phone = document.getElementById('forgotPhone').value;
        
        // In a real application, you would verify the email/phone with your server
        // For this demo, we'll simulate sending verification codes
        
        forgotPasswordForm.style.display = 'none';
        forgotPasswordVerifyForm.style.display = 'flex';
        
        // Simulate sending verification codes
        setTimeout(() => {
            alert('Verification codes have been sent to your email and mobile');
        }, 1000);
    });

    // Forgot Password Verification Form Submission
    forgotPasswordVerifyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real application, you would reset the password with your server
        // For this demo, we'll simulate successful password reset
        
        alert('Password reset successfully! You can now sign in with your new password');
        forgotPasswordVerifyForm.style.display = 'none';
        signinForm.style.display = 'flex';
    });

    // OTP Input Navigation
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });

    // Resend OTP Button
    const resendOtp = document.getElementById('resendOtp');
    
    resendOtp.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Simulate resending OTP
        this.innerHTML = '<i class="fas fa-redo"></i> Code Resent!';
        setTimeout(() => {
            alert('A new verification code has been sent to your email');
            this.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
        }, 1000);
    });

    // Update copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTopButton);

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
        backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    // Back to top button styles (added via JavaScript to avoid extra CSS file)
    const backToTopStyles = document.createElement('style');
    backToTopStyles.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: var(--box-shadow);
            z-index: 999;
            transition: var(--transition);
        }
        
        .back-to-top:hover {
            background-color: var(--secondary-color);
            transform: translateY(-3px);
        }
        
        .night-mode .back-to-top {
            background-color: var(--accent-color);
        }
    `;
    document.head.appendChild(backToTopStyles);

    // Responsive adjustments
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }
    });
});



signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // ⚠️ TEMPORARY DEMO CHECK (REMOVE IN PRODUCTION) ⚠️
    if ((username === "admin" || username === "admin@jhfiletransfer.com") && password === "Demo@1234") {
        // Proceed to OTP verification
        signinForm.style.display = 'none';
        otpForm.style.display = 'flex';
        document.getElementById('userEmail').textContent = "admin@jhfiletransfer.com";
        alert("DEMO MODE: Using test credentials. OTP sent (simulated).");
    } else {
        alert("Invalid credentials. For testing, use:\nEmail: admin@jhfiletransfer.com\nPassword: Demo@1234");
    }
    // ⚠️ REMOVE THIS BLOCK IN PRODUCTION ⚠️
});