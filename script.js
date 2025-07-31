const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
      document.body.classList.add('dark-mode');
      darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });

    async function getProfile() {
      const username = document.getElementById('username').value.trim();
      const errorElement = document.getElementById('error');
      const profile = document.getElementById('profile');

      errorElement.textContent = '';
      errorElement.style.display = 'none';
      profile.style.display = 'none';

      if (!username) {
        showError('Please enter a username');
        return;
      }

      const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

      try {
        const button = document.querySelector('button');
        document.getElementById("search-card").innerHTML = "searching";
        button.disabled = true;

        const res = await fetch(url);

        if (!res.ok) {
          showError('Network error. Please try again later.');
          return;
        }

        const data = await res.json();

        if (data.status !== "success") {
          showError('User not found. Please check the username.');
          return;
        }

        document.getElementById('name').textContent = username;
        document.getElementById('solved').textContent = data.totalSolved || 0;
        document.getElementById('rank').textContent = data.ranking ? `#${data.ranking}` : 'N/A';
        document.getElementById('easy').textContent = data.easySolved || 0;
        document.getElementById('medium').textContent = data.mediumSolved || 0;
        document.getElementById('hard').textContent = data.hardSolved || 0;

        profile.style.display = 'block';
      } catch (err) {
        showError('Network request failed. Check your connection.');
      } finally {
        const button = document.querySelector('button');
        document.getElementById("search-card").innerHTML = "search";
        button.disabled = false;
      }
    }

    function showError(message) {
      const errorElement = document.getElementById('error');
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      document.getElementById('profile').style.display = 'none';
    }
