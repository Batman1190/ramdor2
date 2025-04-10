// Sample video data (replace with your actual data source)
const sampleVideos = [
    {
        id: 1,
        title: "Amazing Video Title 1",
        thumbnail: "https://picsum.photos/300/169",
        duration: "10:30",
        channelName: "Channel Name 1",
        channelAvatar: "https://picsum.photos/50/50",
        views: "1.2M views",
        date: "2 days ago",
        videoUrl: "https://example.com/video1.mp4",
        description: "This is a sample video description that can be quite long and contain multiple lines of text."
    },
    {
        id: 2,
        title: "Incredible Landscapes in 4K",
        thumbnail: "https://picsum.photos/300/170",
        duration: "5:42",
        channelName: "Nature Channel",
        channelAvatar: "https://picsum.photos/50/51",
        views: "850K views",
        date: "1 week ago",
        videoUrl: "https://example.com/video2.mp4",
        description: "Explore the most beautiful landscapes around the world in stunning 4K resolution."
    },
    {
        id: 3,
        title: "How to Create Amazing Websites",
        thumbnail: "https://picsum.photos/300/171",
        duration: "15:22",
        channelName: "Web Dev Pro",
        channelAvatar: "https://picsum.photos/50/52",
        views: "325K views",
        date: "3 days ago",
        videoUrl: "https://example.com/video3.mp4",
        description: "Learn the fundamentals of creating professional and responsive websites in this tutorial."
    },
    {
        id: 4,
        title: "The Science Behind Black Holes",
        thumbnail: "https://picsum.photos/300/172",
        duration: "22:15",
        channelName: "Science Explained",
        channelAvatar: "https://picsum.photos/50/53",
        views: "1.5M views",
        date: "1 month ago",
        videoUrl: "https://example.com/video4.mp4",
        description: "An in-depth explanation of black holes and their fascinating properties."
    },
    {
        id: 5,
        title: "Easy 30-Minute Workout for Beginners",
        thumbnail: "https://picsum.photos/300/173",
        duration: "32:10",
        channelName: "Fitness First",
        channelAvatar: "https://picsum.photos/50/54",
        views: "750K views",
        date: "5 days ago",
        videoUrl: "https://example.com/video5.mp4",
        description: "A beginner-friendly workout routine that you can do at home with no equipment."
    },
    {
        id: 6,
        title: "Top 10 Travel Destinations for 2023",
        thumbnail: "https://picsum.photos/300/174",
        duration: "12:45",
        channelName: "Travel Guide",
        channelAvatar: "https://picsum.photos/50/55",
        views: "980K views",
        date: "2 weeks ago",
        videoUrl: "https://example.com/video6.mp4",
        description: "Discover the most exciting travel destinations you should visit in 2023."
    }
];

// DOM Elements
const videoGrid = document.getElementById('videoGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const suggestedVideos = document.getElementById('suggestedVideos');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const logoContainer = document.querySelector('.logo-container');

// State
let currentPage = 1;
let isLoading = false;
let hasMoreVideos = true;
let isLoggedIn = false;
let currentUser = null;
let authToken = null;
let currentSection = 'home'; // Track current active section

// API endpoints
const API_URL = 'http://localhost:3000/api';

// Create video card element
function createVideoCard(video) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-item';
    videoCard.innerHTML = `
        <div class="thumbnail-container">
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
            <span class="video-duration">${video.duration}</span>
            <div class="video-options">
                <button class="video-option-btn" title="Like"><i class="fas fa-thumbs-up"></i></button>
                <button class="video-option-btn" title="Add to playlist"><i class="fas fa-plus"></i></button>
            </div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <span class="views">${video.views}</span>
                <span class="date">${video.date}</span>
            </div>
            <div class="channel-name">${video.channelName}</div>
        </div>
    `;

    videoCard.addEventListener('click', () => openVideoPlayer(video));
    return videoCard;
}

// Load videos
async function loadVideos(page = 1) {
    if (isLoading || !hasMoreVideos) return;
    
    isLoading = true;
    loadingSpinner.style.display = 'flex';

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real application, replace this with actual API call
        const videos = sampleVideos;
        
        if (videos.length === 0) {
            hasMoreVideos = false;
        } else {
            videos.forEach(video => {
                videoGrid.appendChild(createVideoCard(video));
            });
            currentPage++;
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    } finally {
        isLoading = false;
        loadingSpinner.style.display = 'none';
    }
}

// Infinite scroll handler
function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadVideos(currentPage);
    }
}

// Video player functions
function openVideoPlayer(video) {
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Update video player content
    const videoSource = videoPlayer.querySelector('source');
    videoSource.src = video.videoUrl;
    videoPlayer.load();
    
    document.querySelector('.video-title').textContent = video.title;
    document.querySelector('.views').textContent = video.views;
    document.querySelector('.date').textContent = video.date;
    document.querySelector('.channel-name').textContent = video.channelName;
    document.querySelector('.channel-avatar').src = video.channelAvatar;
    document.querySelector('.video-description').textContent = video.description;
    
    // Load suggested videos
    loadSuggestedVideos(video.id);
}

function closeVideoPlayer() {
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    videoPlayer.pause();
}

function loadSuggestedVideos(currentVideoId) {
    // Filter out the current video and get a few random videos
    const suggested = sampleVideos
        .filter(video => video.id !== currentVideoId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
        
    suggestedVideos.innerHTML = '';
    
    suggested.forEach(video => {
        const suggestedItem = document.createElement('div');
        suggestedItem.className = 'video-item';
        suggestedItem.innerHTML = `
            <div class="thumbnail-container">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="channel-name">${video.channelName}</div>
                <div class="video-meta">
                    <span class="views">${video.views}</span>
                </div>
            </div>
        `;
        
        suggestedItem.addEventListener('click', () => {
            openVideoPlayer(video);
        });
        
        suggestedVideos.appendChild(suggestedItem);
    });
}

// Mini player functionality
let miniPlayer = null;

function createMiniPlayer(video) {
    if (miniPlayer) {
        miniPlayer.remove();
    }

    miniPlayer = document.createElement('div');
    miniPlayer.className = 'mini-player';
    miniPlayer.innerHTML = `
        <video src="${video.videoUrl}" controls></video>
        <div class="mini-player-controls">
            <span class="mini-player-title">${video.title}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(miniPlayer);
    miniPlayer.style.display = 'block';
}

// Initialize the application after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make logo clickable to return to home
    logoContainer.addEventListener('click', () => {
        navigateToSection('home');
        document.querySelectorAll('.sidebar li').forEach(i => i.classList.remove('active'));
        document.querySelector('.sidebar li:first-child').classList.add('active');
    });

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            performSearch(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });

    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Handle navigation based on the clicked item
            const sectionText = item.querySelector('span').textContent.trim();
            let section = sectionText.toLowerCase().replace(/\s+/g, '');
            
            if (section === 'profile') {
                if (!isLoggedIn) {
                    toggleLogin();
                }
                return;
            }
            
            if (section === 'create') {
                if (!isLoggedIn) {
                    showLoginPrompt();
                    return;
                }
                // Handle create functionality
                showMessage('Upload feature coming soon!');
                return;
            }
            
            if (section === 'library') {
                if (!isLoggedIn) {
                    showLoginPrompt();
                    return;
                }
                navigateToSection('library');
                return;
            }
            
            if (section === 'explore') {
                navigateToSection('trending');
                return;
            }
            
            if (section === 'home') {
                navigateToSection('home');
            }
        });
    });

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const isLoginRequired = item.classList.contains('login-required');
            const sectionText = item.textContent.trim();
            let section = sectionText.toLowerCase().replace(/\s+/g, '');
            
            if (isLoginRequired && !isLoggedIn) {
                showLoginPrompt();
                return;
            }
            
            // Update active item in the sidebar
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Handle navigation to the section
            navigateToSection(section);
        });
    });

    // Login button functionality
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', () => {
        toggleLogin();
    });

    // Add upload button event listener
    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', () => {
        toggleUpload();
    });

    // Event listeners for elements that should exist now
    window.addEventListener('scroll', handleScroll);
    
    // Check if videoModal exists before adding listener
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoPlayer();
            }
        });
    } else {
        console.error('Video modal element not found!');
    }

    // Initial video load
    loadVideos();
    
    // Handle mobile responsiveness
    function handleResize() {
        const sidebar = document.querySelector('.sidebar');
        const mobileNav = document.querySelector('.mobile-nav');
        const mainContent = document.querySelector('.main-content');

        if (sidebar && mobileNav && mainContent) {
            if (window.innerWidth <= 768) {
                sidebar.style.display = 'none';
                mobileNav.style.display = 'flex';
                mainContent.style.marginLeft = '0';
            } else {
                sidebar.style.display = 'block';
                mobileNav.style.display = 'none';
                mainContent.style.marginLeft = '240px';
            }
        } else {
            console.error('Required layout elements not found for resize handling.');
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set layout based on current size
});

// Function to perform search
function performSearch(searchTerm) {
    isLoading = true;
    loadingSpinner.style.display = 'flex';
    
    // Clear current videos
    videoGrid.innerHTML = '';
    
    // Update headline
    let headline = document.querySelector('.section-headline');
    if (!headline) {
        headline = document.createElement('h2');
        headline.className = 'section-headline';
        videoGrid.parentNode.insertBefore(headline, videoGrid);
    }
    headline.textContent = `Search results for "${searchTerm}"`;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real application, this would call the searchVideos API
        // For now, we'll filter the sample videos
        const searchResults = sampleVideos.filter(video => 
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (searchResults.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <p>No videos found for "${searchTerm}"</p>
                <p>Try different keywords or check your spelling</p>
            `;
            videoGrid.appendChild(noResults);
        } else {
            searchResults.forEach(video => {
                videoGrid.appendChild(createVideoCard(video));
            });
        }
        
        isLoading = false;
        loadingSpinner.style.display = 'none';
    }, 1000);
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store auth data
    authToken = data.token;
    currentUser = data.user;
    isLoggedIn = true;

    // Update UI
    updateAuthUI();
    showMessage('Successfully logged in!', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Signup function
async function signup(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    // Store auth data
    authToken = data.token;
    currentUser = data.user;
    isLoggedIn = true;

    // Update UI
    updateAuthUI();
    showMessage('Successfully signed up!', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Logout function
function logout() {
  authToken = null;
  currentUser = null;
  isLoggedIn = false;
  updateAuthUI();
  showMessage('Successfully logged out!', 'success');
}

// Update UI based on auth state
function updateAuthUI() {
  const loginBtn = document.querySelector('.login-btn');
  const uploadBtn = document.querySelector('.upload-btn');
  const loginRequiredSections = document.querySelectorAll('.login-required');

  if (isLoggedIn) {
    loginBtn.textContent = 'Logout';
    loginBtn.classList.add('logged-in');
    uploadBtn.style.display = 'flex';
    loginRequiredSections.forEach(section => {
      section.style.opacity = '1';
      section.style.pointerEvents = 'auto';
    });
  } else {
    loginBtn.textContent = 'Login';
    loginBtn.classList.remove('logged-in');
    uploadBtn.style.display = 'none';
    loginRequiredSections.forEach(section => {
      section.style.opacity = '0.5';
      section.style.pointerEvents = 'none';
    });
  }
}

// Show message notification
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Toggle login/signup modal
function toggleLogin() {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-content">
      <h2>${isLoggedIn ? 'Logout' : 'Login'}</h2>
      ${isLoggedIn ? `
        <p>Are you sure you want to logout?</p>
        <button onclick="logout()">Logout</button>
      ` : `
        <form id="authForm">
          <input type="email" placeholder="Email" required>
          <input type="password" placeholder="Password" required>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="#" onclick="toggleSignup()">Sign up</a></p>
        </form>
      `}
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  if (!isLoggedIn) {
    const form = modal.querySelector('#authForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;
      login(email, password);
      modal.remove();
    });
  }
}

// Toggle signup modal
function toggleSignup() {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-content">
      <h2>Sign Up</h2>
      <form id="signupForm">
        <input type="text" placeholder="Username" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Sign Up</button>
        <p>Already have an account? <a href="#" onclick="toggleLogin()">Login</a></p>
      </form>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#signupForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    signup(username, email, password);
    modal.remove();
  });
}

// Function to show login prompt
function showLoginPrompt() {
    showMessage('Please log in to access this feature');
}

// Function to navigate to different sections
function navigateToSection(section) {
    currentSection = section;
    currentPage = 1;
    hasMoreVideos = true;
    
    // Clear current videos
    videoGrid.innerHTML = '';
    
    // Update headline in the main content area
    let headline = document.querySelector('.section-headline');
    if (!headline) {
        headline = document.createElement('h2');
        headline.className = 'section-headline';
        videoGrid.parentNode.insertBefore(headline, videoGrid);
    }
    
    switch (section) {
        case 'home':
            headline.textContent = 'Recommended Videos';
            loadVideos();
            break;
        case 'shorts':
            headline.textContent = 'Shorts';
            loadSpecializedContent('shorts');
            break;
        case 'trending':
            headline.textContent = 'Trending Videos';
            loadSpecializedContent('trending');
            break;
        case 'myspace':
            headline.textContent = 'MySpace';
            loadSpecializedContent('myspace');
            break;
        case 'library':
            headline.textContent = 'Your Library';
            loadSpecializedContent('library');
            break;
        case 'history':
            headline.textContent = 'Watch History';
            loadSpecializedContent('history');
            break;
        case 'watchlater':
            headline.textContent = 'Watch Later';
            loadSpecializedContent('watchlater');
            break;
        case 'likedvideos':
            headline.textContent = 'Liked Videos';
            loadSpecializedContent('liked');
            break;
        default:
            headline.textContent = 'Recommended Videos';
            loadVideos();
    }
}

// Function to load specialized content for different sections
function loadSpecializedContent(type) {
    isLoading = true;
    loadingSpinner.style.display = 'flex';
    
    // Clear existing content
    videoGrid.innerHTML = '';
    
    // Simulate loading delay
    setTimeout(() => {
        let filteredVideos;
        
        switch(type) {
            case 'shorts':
                // Filter for short videos (under 1 minute)
                filteredVideos = sampleVideos.filter(video => {
                    const [minutes, seconds] = video.duration.split(':').map(Number);
                    return minutes === 0 && seconds < 60;
                });
                break;
            case 'trending':
                // Simulate trending videos (most views)
                filteredVideos = [...sampleVideos].sort((a, b) => {
                    const viewsA = parseInt(a.views.replace('M', '000000').replace('K', '000'));
                    const viewsB = parseInt(b.views.replace('M', '000000').replace('K', '000'));
                    return viewsB - viewsA;
                });
                break;
            case 'myspace':
                // Simulated subscribed channels
                filteredVideos = sampleVideos.filter(video => 
                    ['Channel Name 1', 'Science Explained', 'Web Dev Pro'].includes(video.channelName)
                );
                break;
            case 'library':
                // Combined collection of various videos
                filteredVideos = sampleVideos;
                break;
            case 'history':
                // Simulated history (random selection with recency)
                filteredVideos = [...sampleVideos]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4)
                    .map(video => ({
                        ...video,
                        date: 'Watched recently'
                    }));
                break;
            case 'watchlater':
                // Simulated watch later (subset of videos)
                filteredVideos = sampleVideos.filter((_, index) => index % 2 === 0);
                break;
            case 'liked':
                // Simulated liked videos (subset of videos)
                filteredVideos = sampleVideos.filter((_, index) => index % 3 === 0);
                break;
            default:
                filteredVideos = sampleVideos;
        }
        
        // Render the specialized content
        filteredVideos.forEach(video => {
            videoGrid.appendChild(createVideoCard(video));
        });
        
        isLoading = false;
        loadingSpinner.style.display = 'none';
    }, 1000);
}

// Video upload function
async function uploadVideo(formData) {
  try {
    const response = await fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload video');
    }

    showMessage('Video uploaded successfully!', 'success');
    return data.video;
  } catch (error) {
    showMessage(error.message, 'error');
    throw error;
  }
}

// Toggle upload modal
function toggleUpload() {
  if (!isLoggedIn) {
    showMessage('Please log in to upload videos', 'error');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-content">
      <h2>Upload Video</h2>
      <form id="uploadForm">
        <input type="text" name="title" placeholder="Video Title" required>
        <textarea name="description" placeholder="Video Description" rows="4"></textarea>
        <div class="file-input-container">
          <input type="file" name="video" accept="video/*" required>
          <div class="upload-progress" style="display: none;">
            <div class="progress-bar"></div>
            <div class="progress-text">0%</div>
          </div>
        </div>
        <button type="submit">Upload Video</button>
      </form>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#uploadForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const progressBar = modal.querySelector('.progress-bar');
    const progressText = modal.querySelector('.progress-text');
    const uploadProgress = modal.querySelector('.upload-progress');
    
    try {
      uploadProgress.style.display = 'block';
      
      const video = await uploadVideo(formData);
      
      // Add the new video to the UI
      const videoCard = createVideoCard({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: 'https://via.placeholder.com/320x180',
        views: 0,
        timestamp: 'Just now',
        channel: currentUser.username,
      });
      
      const videoGrid = document.querySelector('.video-grid');
      videoGrid.insertBefore(videoCard, videoGrid.firstChild);
      
      modal.remove();
    } catch (error) {
      uploadProgress.style.display = 'none';
    }
  });
}