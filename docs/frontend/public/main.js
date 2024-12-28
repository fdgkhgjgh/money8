document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const file = document.getElementById('fileInput').files[0];

        if (!title || !content) {
            alert('Please fill in the title and content.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Post created successfully!');
                form.reset();
                fetchPosts();
            } else {
                throw new Error('Failed to create post');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the post.');
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            const posts = await response.json();
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    ${post.fileUrl ? `<a href="${post.fileUrl}" target="_blank">View File</a>` : ''}
                `;
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    fetchPosts(); // Fetch posts when the page loads
});