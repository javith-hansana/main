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

    // Form Step Navigation
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Initialize first step
    showStep(1);
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const nextStepNum = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                showStep(nextStepNum);
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStepNum = parseInt(this.getAttribute('data-prev'));
            showStep(prevStepNum);
        });
    });
    
    function showStep(stepNum) {
        // Hide all steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.querySelector(`.form-step[data-step="${stepNum}"]`).classList.add('active');
        
        // Update progress steps
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber < stepNum) {
                step.classList.add('completed');
            } else if (stepNumber === stepNum) {
                step.classList.add('active');
            }
        });
        
        // Scroll to top of form
        document.querySelector('.registration-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
                
                // Reset border color when user starts typing
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            }
        });
        
        // Additional validation for specific steps
        if (step.getAttribute('data-step') === '1') {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            if (password.value !== confirmPassword.value) {
                confirmPassword.style.borderColor = 'var(--danger-color)';
                isValid = false;
                
                confirmPassword.addEventListener('input', function() {
                    if (password.value === this.value) {
                        this.style.borderColor = '';
                    }
                });
            }
            
            // Password strength check
            if (password.value.length < 8) {
                password.style.borderColor = 'var(--danger-color)';
                isValid = false;
            }
        }
        
        if (step.getAttribute('data-step') === '3') {
            const termsCheckbox = document.getElementById('terms');
            const packageSelected = document.querySelector('.package-card.selected');
            
            if (!termsCheckbox.checked) {
                termsCheckbox.nextElementSibling.style.color = 'var(--danger-color)';
                isValid = false;
                
                termsCheckbox.addEventListener('change', function() {
                    this.nextElementSibling.style.color = '';
                });
            }
            
            if (!packageSelected) {
                alert('Please select a package before continuing');
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Password Strength Indicator
    const passwordInput = document.getElementById('password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Cap at 3 for our 3-bar display
        strength = Math.min(strength, 3);
        
        // Update UI
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.style.backgroundColor = getStrengthColor(strength);
            } else {
                bar.style.backgroundColor = '#e0e0e0';
            }
        });
        
        strengthText.textContent = getStrengthText(strength);
        strengthText.style.color = getStrengthColor(strength);
    });
    
    function getStrengthColor(strength) {
        switch(strength) {
            case 1: return '#ff4d4d'; // Weak
            case 2: return '#ffcc00'; // Medium
            case 3: return '#4bb543'; // Strong
            default: return '#e0e0e0'; // Default
        }
    }
    
    function getStrengthText(strength) {
        switch(strength) {
            case 0: return 'Password Strength';
            case 1: return 'Weak';
            case 2: return 'Medium';
            case 3: return 'Strong';
            default: return '';
        }
    }

    // Verification Tab Switching
    const verificationTabs = document.querySelectorAll('.verification-tab');
    const verificationContents = document.querySelectorAll('.verification-content');
    
    verificationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            verificationTabs.forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding content
            verificationContents.forEach(content => {
                content.classList.remove('active');
            });
            document.querySelector(`.verification-content[data-tab-content="${tabName}"]`).classList.add('active');
        });
    });

    // Verification Code Handling
    const sendCodeButtons = document.querySelectorAll('.send-code-btn');
    const verificationCodeContainer = document.querySelector('.verification-code-container');
    const verificationTarget = document.querySelector('.verification-target');
    const codeInputs = document.querySelectorAll('.code-input');
    
    sendCodeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            let target = '';
            
            if (type === 'email') {
                const email = document.getElementById('email').value;
                target = email;
                verificationTarget.textContent = email;
            } else {
                const phone = document.getElementById('phoneNumber').value;
                target = phone;
                verificationTarget.textContent = phone;
            }
            
            // Simulate sending code
            setTimeout(() => {
                verificationCodeContainer.style.display = 'block';
                
                // Show success message
                const originalText = this.textContent;
                this.textContent = 'Code Sent!';
                this.disabled = true;
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 3000);
            }, 1000);
        });
    });

    // Verification Code Input Navigation
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
            }
        });
    });

    // Resend Code Button
    const resendCodeBtn = document.querySelector('.resend-code');
    resendCodeBtn.addEventListener('click', function() {
        // Simulate resending code
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-redo"></i> Code Resent!';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
            }, 3000);
        }, 1000);
    });

    // Package Selection
    const packageButtons = document.querySelectorAll('.select-package');
    
    packageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all packages
            document.querySelectorAll('.package-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to current package
            const packageCard = this.closest('.package-card');
            packageCard.classList.add('selected');
            
            // Update button styles
            packageButtons.forEach(btn => {
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            });
            
            this.classList.add('btn-primary');
            this.classList.remove('btn-secondary');
        });
    });

    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('data-method');
            
            // Update active method
            paymentMethods.forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding details
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            document.querySelector(`.${methodType}-details`).style.display = 'block';
        });
    });

    // Profile Picture Upload Modal
    const uploadProfileBtn = document.getElementById('uploadProfileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeModal = document.querySelector('.close-modal');
    const uploadArea = document.getElementById('uploadArea');
    const previewArea = document.getElementById('previewArea');
    const profileUpload = document.getElementById('profileUpload');
    const imagePreview = document.getElementById('imagePreview');
    const profilePreview = document.getElementById('profilePreview');
    const finalProfilePreview = document.getElementById('finalProfilePreview');
    const cancelCrop = document.getElementById('cancelCrop');
    const saveCrop = document.getElementById('saveCrop');
    
    // Open modal from step 1
    uploadProfileBtn.addEventListener('click', function() {
        profileModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        profileModal.style.display = 'none';
        resetUploader();
    });
    
    // Click anywhere outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
            resetUploader();
        }
    });
    
    // Handle file upload
    uploadArea.addEventListener('click', function() {
        profileUpload.click();
    });
    
    profileUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                imagePreview.src = event.target.result;
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = '';
        this.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.backgroundColor = '';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            profileUpload.files = e.dataTransfer.files;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                imagePreview.src = event.target.result;
            }
            reader.readAsDataURL(e.dataTransfer.files[0]);
        }
    });
    
    // Cancel crop
    cancelCrop.addEventListener('click', function() {
        resetUploader();
    });
    
    // Save crop (simplified - in real app you would implement actual cropping)
    saveCrop.addEventListener('click', function() {
        profilePreview.src = imagePreview.src;
        finalProfilePreview.src = imagePreview.src;
        profileModal.style.display = 'none';
        resetUploader();
    });
    
    function resetUploader() {
        uploadArea.style.display = 'block';
        previewArea.style.display = 'none';
        profileUpload.value = '';
    }

    // Form Submission
    const registrationForm = document.getElementById('registrationForm');
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the form data to your server here
        // For this demo, we'll just show a success message
        
        showStep(5);
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