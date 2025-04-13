document.addEventListener('DOMContentLoaded', function() {
    // Check subscription status on page load
    const checkSubscriptionStatus = () => {
        const hasPremium = localStorage.getItem('premiumSubscription') === 'active';
        
        if(hasPremium) {
            // Add premium user class to body
            document.body.classList.add('premium-user');
            
            // Unlock premium content
            unlockPremiumContent();
            
            // Update subscription info if on premium page
            updateSubscriptionInfo();
        } else {
            // Add locks to premium content
            lockPremiumContent();
        }
    };
    
    // Unlock premium content for subscribers
    const unlockPremiumContent = () => {
        // Remove premium locks from buttons
        document.querySelectorAll('.premium-locked').forEach(element => {
            element.classList.remove('premium-locked');
        });
        
        // Show premium content sections
        document.querySelectorAll('.premium-only-content').forEach(content => {
            content.classList.remove('hidden');
        });
        
        // Enable premium links
        document.querySelectorAll('a.premium-content').forEach(link => {
            // Clone the link to remove event listeners
            const newLink = link.cloneNode(true);
            
            // Update the clone
            newLink.classList.remove('premium-content');
            newLink.classList.add('premium-unlocked');
            
            // Remove crown icon
            const icon = newLink.querySelector('.fa-crown');
            if(icon) {
                icon.remove();
            }
            
            // Replace the original link
            link.parentNode.replaceChild(newLink, link);
        });
    };
    
    // Add locks to premium content
    const lockPremiumContent = () => {
        // Add event listeners to premium content links
        document.querySelectorAll('a.premium-content').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Open subscription modal
                const subscriptionModal = document.getElementById('subscriptionModal');
                if(subscriptionModal) {
                    subscriptionModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Hide premium-only content
        document.querySelectorAll('.premium-only-content').forEach(content => {
            content.classList.add('hidden');
        });
    };
    
    // Update subscription info on premium page
    const updateSubscriptionInfo = () => {
        const subscriptionInfoElement = document.getElementById('subscription-info');
        
        if(subscriptionInfoElement) {
            const plan = localStorage.getItem('subscriptionPlan') || 'monthly';
            const dateString = localStorage.getItem('subscriptionDate');
            let date = 'Unknown date';
            
            if(dateString) {
                const subscriptionDate = new Date(dateString);
                date = subscriptionDate.toLocaleDateString();
                
                // Calculate renewal date
                const renewalDate = new Date(subscriptionDate);
                if(plan === 'monthly') {
                    renewalDate.setMonth(renewalDate.getMonth() + 1);
                } else {
                    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                }
                
                // Update info
                subscriptionInfoElement.innerHTML = `
                    <p><strong>Current Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                    <p><strong>Start Date:</strong> ${date}</p>
                    <p><strong>Next Renewal:</strong> ${renewalDate.toLocaleDateString()}</p>
                `;
                
                // Show cancel button
                const cancelButton = document.getElementById('cancel-subscription');
                if(cancelButton) {
                    cancelButton.classList.remove('hidden');
                    
                    // Add event listener
                    cancelButton.addEventListener('click', function() {
                        if(confirm('Are you sure you want to cancel your subscription? You will lose access to premium content.')) {
                            // Cancel subscription
                            localStorage.removeItem('premiumSubscription');
                            localStorage.removeItem('subscriptionPlan');
                            localStorage.removeItem('subscriptionDate');
                            
                            // Reload page
                            window.location.reload();
                        }
                    });
                }
            }
        }
    };
    
    // Handle subscription buttons
    const initSubscriptionButtons = () => {
        const subscribeBtns = document.querySelectorAll('.subscribe-btn');
        const subscriptionSuccess = document.querySelector('.subscription-message.success');
        
        subscribeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // In a real app, you would process the subscription here
                const plan = btn.getAttribute('data-plan');
                console.log(`Processing ${plan} subscription`);
                
                // Show success message
                if(subscriptionSuccess) {
                    subscriptionSuccess.classList.remove('hidden');
                }
                
                // Save subscription status to localStorage for demo purposes
                localStorage.setItem('premiumSubscription', 'active');
                localStorage.setItem('subscriptionPlan', plan);
                localStorage.setItem('subscriptionDate', new Date().toISOString());
                
                // Update UI to show user is premium
                document.body.classList.add('premium-user');
                
                // If on a subject page, unlock premium content
                if(document.querySelector('.subject-page')) {
                    setTimeout(() => {
                        unlockPremiumContent();
                    }, 2000);
                }
            });
        });
    };
    
    // Initialize subscription functionality
    checkSubscriptionStatus();
    initSubscriptionButtons();
});
