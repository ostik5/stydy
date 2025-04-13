document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites system
    const initFavorites = () => {
        // Get favorites from localStorage
        const favorites = getFavorites();
        
        // Add favorite buttons to study notes
        addFavoriteButtons();
        
        // Initialize favorites page if on index
        if(document.getElementById('favorites-list')) {
            renderFavoritesList(favorites);
        }
        
        // Add event listener to favorites link
        const favoritesLink = document.getElementById('favorites-link');
        if(favoritesLink) {
            favoritesLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle favorites section
                const favoritesSection = document.getElementById('favorites');
                favoritesSection.classList.toggle('hidden');
                
                // Scroll to favorites section if visible
                if(!favoritesSection.classList.contains('hidden')) {
                    favoritesSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Re-render favorites list
                    renderFavoritesList(getFavorites());
                }
            });
        }
    };
    
    // Get favorites from localStorage
    const getFavorites = () => {
        const favoritesJson = localStorage.getItem('studyFavorites');
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    };
    
    // Save favorites to localStorage
    const saveFavorites = (favorites) => {
        localStorage.setItem('studyFavorites', JSON.stringify(favorites));
    };
    
    // Add a note to favorites
    const addToFavorites = (note) => {
        const favorites = getFavorites();
        
        // Check if already in favorites
        const exists = favorites.some(fav => 
            fav.id === note.id && 
            fav.subject === note.subject && 
            fav.grade === note.grade
        );
        
        if(!exists) {
            favorites.push(note);
            saveFavorites(favorites);
            showNotification('Added to favorites!');
            return true;
        }
        
        return false;
    };
    
    // Remove a note from favorites
    const removeFromFavorites = (noteId) => {
        const favorites = getFavorites();
        const updatedFavorites = favorites.filter(note => note.id !== noteId);
        
        saveFavorites(updatedFavorites);
        showNotification('Removed from favorites');
        
        return updatedFavorites;
    };
    
    // Check if a note is in favorites
    const isInFavorites = (noteId) => {
        const favorites = getFavorites();
        return favorites.some(note => note.id === noteId);
    };
    
    // Add favorite buttons to study notes
    const addFavoriteButtons = () => {
        // Get all study note headers
        const noteHeaders = document.querySelectorAll('.study-note-header');
        
        noteHeaders.forEach(header => {
            // Create bookmark button
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            
            // Get note information
            const noteSection = header.closest('.study-note');
            const noteId = noteSection.id;
            const noteTitle = header.querySelector('h2, h3').innerText;
            
            // Find subject and grade
            let subject = '';
            let grade = '';
            
            const subjectPage = noteSection.closest('.subject-page');
            if(subjectPage) {
                subject = subjectPage.querySelector('h1').innerText;
            }
            
            // Try to determine grade from ID (format: g7-topic, g8-topic, etc.)
            if(noteId.startsWith('g')) {
                const gradeMatch = noteId.match(/g(\d+)/);
                if(gradeMatch && gradeMatch[1]) {
                    grade = `Grade ${gradeMatch[1]}`;
                }
            }
            
            // Set button HTML based on favorite status
            const isFavorite = isInFavorites(noteId);
            bookmarkBtn.innerHTML = isFavorite ? 
                '<i class="fas fa-bookmark"></i>' : 
                '<i class="far fa-bookmark"></i>';
            
            bookmarkBtn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
            bookmarkBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
            
            // Add event listener
            bookmarkBtn.addEventListener('click', function() {
                const isFav = isInFavorites(noteId);
                
                if(isFav) {
                    // Remove from favorites
                    removeFromFavorites(noteId);
                    
                    // Update button
                    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
                    bookmarkBtn.setAttribute('aria-label', 'Add to favorites');
                    bookmarkBtn.title = 'Add to favorites';
                } else {
                    // Add to favorites
                    const noteData = {
                        id: noteId,
                        title: noteTitle,
                        subject: subject,
                        grade: grade,
                        url: window.location.pathname + '#' + noteId
                    };
                    
                    addToFavorites(noteData);
                    
                    // Update button
                    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                    bookmarkBtn.setAttribute('aria-label', 'Remove from favorites');
                    bookmarkBtn.title = 'Remove from favorites';
                }
            });
            
            // Add button to header
            header.appendChild(bookmarkBtn);
        });
    };
    
    // Render favorites list
    const renderFavoritesList = (favorites) => {
        const favoritesList = document.getElementById('favorites-list');
        
        if(favoritesList) {
            // Clear current list
            favoritesList.innerHTML = '';
            
            if(favorites.length === 0) {
                // Show empty state
                favoritesList.innerHTML = `
                    <div class="empty-favorites">
                        <i class="fas fa-bookmark"></i>
                        <p>You haven't saved any favorites yet. Click the bookmark icon on any study note to add it to your favorites.</p>
                    </div>
                `;
            } else {
                // Render favorites
                favorites.forEach(note => {
                    const subjectClass = getSubjectClass(note.subject);
                    
                    const favoriteItem = document.createElement('div');
                    favoriteItem.className = 'favorite-item';
                    favoriteItem.innerHTML = `
                        <div class="subject-badge badge-${subjectClass}">${note.subject}</div>
                        <h3>${note.title}</h3>
                        <p class="grade">${note.grade}</p>
                        <div class="actions">
                            <a href="${note.url}" class="btn btn-primary btn-sm">View Note</a>
                            <button class="btn btn-secondary btn-sm remove-favorite" data-note-id="${note.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    `;
                    
                    favoritesList.appendChild(favoriteItem);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-favorite').forEach(button => {
                    button.addEventListener('click', function() {
                        const noteId = this.getAttribute('data-note-id');
                        const updatedFavorites = removeFromFavorites(noteId);
                        
                        // Re-render favorites list
                        renderFavoritesList(updatedFavorites);
                    });
                });
            }
        }
    };
    
    // Helper function to get subject class for styling
    const getSubjectClass = (subject) => {
        const subjectMap = {
            'Mathematics': 'math',
            'Physics': 'physics',
            'Chemistry': 'chemistry',
            'Biology': 'biology',
            'History': 'history',
            'Literature': 'literature'
        };
        
        return subjectMap[subject] || 'math';
    };
    
    // Show notification
    const showNotification = (message, type = 'success') => {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        if(!notificationContainer) {
            // Create container
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after timeout
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Initialize favorites system
    initFavorites();
});
