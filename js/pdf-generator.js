document.addEventListener('DOMContentLoaded', function() {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    
    // Add PDF generation buttons to downloadable content
    const addPdfButtons = () => {
        // Get all study note sections that could be downloaded
        const studyNoteSections = document.querySelectorAll('.study-note-content');
        
        studyNoteSections.forEach((section, index) => {
            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'pdf-download-container';
            
            // Create download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-secondary pdf-download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Download as PDF';
            downloadBtn.setAttribute('data-note-id', index);
            
            // Check if user is premium
            const hasPremium = localStorage.getItem('premiumSubscription') === 'active';
            
            if(!hasPremium) {
                downloadBtn.className += ' premium-locked';
                downloadBtn.innerHTML += ' <i class="fas fa-crown"></i>';
            }
            
            buttonContainer.appendChild(downloadBtn);
            
            // Insert button after the section
            section.parentNode.insertBefore(buttonContainer, section.nextSibling);
            
            // Add event listener
            downloadBtn.addEventListener('click', function(e) {
                const noteId = e.currentTarget.getAttribute('data-note-id');
                const isPremiumLocked = e.currentTarget.classList.contains('premium-locked');
                
                if(isPremiumLocked) {
                    // Show subscription modal
                    const subscriptionModal = document.getElementById('subscriptionModal');
                    if(subscriptionModal) {
                        subscriptionModal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    }
                } else {
                    // Generate PDF
                    generatePDF(section);
                }
            });
        });
    };
    
    // Generate PDF from content
    const generatePDF = (content) => {
        try {
            // Get content information
            const title = content.querySelector('h2, h3').innerText;
            const subjectElement = content.closest('.subject-page');
            const subject = subjectElement ? subjectElement.querySelector('h1').innerText : 'Study Note';
            
            // Create PDF
            const pdf = new jsPDF();
            
            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(74, 111, 165);
            pdf.text(title, 20, 20);
            
            // Add subtitle (subject)
            pdf.setFontSize(14);
            pdf.setTextColor(100, 100, 100);
            pdf.text(subject, 20, 30);
            
            // Add date
            pdf.setFontSize(10);
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 37);
            
            // Add separator line
            pdf.setDrawColor(200, 200, 200);
            pdf.line(20, 40, 190, 40);
            
            // Get text content
            const textElements = content.querySelectorAll('p, li, .note-text');
            let yPosition = 50;
            
            // Set text style
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            
            // Add each text element to PDF
            textElements.forEach(element => {
                const text = element.innerText;
                const textLines = pdf.splitTextToSize(text, 170);
                
                // Check if we need a new page
                if(yPosition + (textLines.length * 7) > 280) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                // Add text
                pdf.text(textLines, 20, yPosition);
                yPosition += (textLines.length * 7) + 5;
            });
            
            // Add footer
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            const totalPages = pdf.internal.getNumberOfPages();
            
            for(let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.text(`Study Notes Hub - Page ${i} of ${totalPages}`, 20, 287);
                pdf.text('© 2023 Study Notes Hub. For educational purposes only.', 20, 292);
            }
            
            // Save PDF
            pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            
            // Display notification
            showNotification('PDF successfully downloaded!');
            
        } catch(error) {
            console.error('Error generating PDF:', error);
            showNotification('Failed to generate PDF. Please try again.', 'error');
        }
    };
    
    // Show notification
    const showNotification = (message, type = 'success') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after timeout
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Initialize PDF buttons if on a subject page
    if(document.querySelector('.subject-page') || document.querySelector('.study-note-content')) {
        addPdfButtons();
    }
});
