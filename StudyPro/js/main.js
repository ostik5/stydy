document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if(mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
            
            // Toggle icon between bars and x
            const icon = mobileNavToggle.querySelector('i');
            if(isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Handle dropdowns on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Toggle chevron icon
                const icon = link.querySelector('i');
                if(dropdown.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
    
    // Grade Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const grade = button.getAttribute('data-grade');
            document.getElementById(`grade${grade}`).classList.add('active');
        });
    });
    
    // Footer grade links
    const footerGradeLinks = document.querySelectorAll('.footer-column a[data-grade]');
    
    footerGradeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const grade = link.getAttribute('data-grade');
            
            // Scroll to grades section
            document.getElementById('grades').scrollIntoView({ behavior: 'smooth' });
            
            // Activate the corresponding tab
            setTimeout(() => {
                document.querySelector(`.tab-btn[data-grade="${grade}"]`).click();
            }, 500);
        });
    });
    
    // Donation Modal
    const donateBtn = document.getElementById('donateBtn');
    const donateFooter = document.getElementById('donateFooter');
    const donationModal = document.getElementById('donationModal');
    const closeModalBtn = donationModal.querySelector('.close-modal');
    const donationOptions = document.querySelectorAll('.donation-option');
    const processDonationBtn = document.getElementById('processDonation');
    const donationSuccess = document.querySelector('.donation-message.success');
    
    function openDonationModal() {
        donationModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeDonationModal() {
        donationModal.style.display = 'none';
        document.body.style.overflow = '';
        // Reset modal state
        donationOptions.forEach(option => option.classList.remove('selected'));
        donationSuccess.classList.add('hidden');
    }
    
    if(donateBtn) {
        donateBtn.addEventListener('click', openDonationModal);
    }
    
    if(donateFooter) {
        donateFooter.addEventListener('click', openDonationModal);
    }
    
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDonationModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if(e.target === donationModal) {
            closeDonationModal();
        }
    });
    
    // Donation option selection
    donationOptions.forEach(option => {
        option.addEventListener('click', function() {
            donationOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Process donation
    if(processDonationBtn) {
        processDonationBtn.addEventListener('click', function() {
            // In a real app, you would process the payment here
            // For this demo, we'll just show the success message
            donationSuccess.classList.remove('hidden');
            
            // Reset after 5 seconds and close modal
            setTimeout(function() {
                closeDonationModal();
            }, 5000);
        });
    }
    
    // Premium content modal handlers
    const premiumLinks = document.querySelectorAll('.premium-content');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const closeSubscriptionModal = subscriptionModal.querySelector('.close-modal');
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const subscriptionSuccess = document.querySelector('.subscription-message.success');
    const goToPremiumBtn = document.getElementById('goToPremium');
    
    premiumLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            subscriptionModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    if(closeSubscriptionModal) {
        closeSubscriptionModal.addEventListener('click', function() {
            subscriptionModal.style.display = 'none';
            document.body.style.overflow = '';
            subscriptionSuccess.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if(e.target === subscriptionModal) {
            subscriptionModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Subscribe button handlers
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, you would process the subscription here
            const plan = btn.getAttribute('data-plan');
            console.log(`Processing ${plan} subscription`);
            
            // Show success message
            subscriptionSuccess.classList.remove('hidden');
            
            // Save subscription status to localStorage for demo purposes
            localStorage.setItem('premiumSubscription', 'active');
            localStorage.setItem('subscriptionPlan', plan);
            localStorage.setItem('subscriptionDate', new Date().toISOString());
            
            // Update UI to show user is premium
            document.body.classList.add('premium-user');
        });
    });
    
    if(goToPremiumBtn) {
        goToPremiumBtn.addEventListener('click', function() {
            window.location.href = 'premium/index.html';
        });
    }
    
    // Check if user has premium subscription on page load
    const hasPremium = localStorage.getItem('premiumSubscription') === 'active';
    if(hasPremium) {
        document.body.classList.add('premium-user');
    }
});
