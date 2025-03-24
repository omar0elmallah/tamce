// تحميل المنشورات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', loadPosts);

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('postsContainer');
    posts.forEach(post => {
        const postDiv = createPostElement(post.text, post.time);
        postsContainer.appendChild(postDiv);
    });
}

function createPostElement(text, time) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postContent = document.createElement('p');
    postContent.textContent = text;

    const postTime = document.createElement('div');
    postTime.classList.add('time');
    postTime.textContent = time;

    postDiv.appendChild(postContent);
    postDiv.appendChild(postTime);

    return postDiv;
}

function addPost() {
    const postInput = document.getElementById('postInput');
    const postText = postInput.value.trim();

    if (postText === '') {
        alert('يرجى كتابة شيء للنشر!');
        return;
    }

    const postTime = new Date().toLocaleString('ar-EG');
    const post = { text: postText, time: postTime };

    // إضافة المنشور إلى الصفحة
    const postsContainer = document.getElementById('postsContainer');
    const postDiv = createPostElement(postText, postTime);
    postsContainer.insertBefore(postDiv, postsContainer.firstChild);

    // حفظ المنشور في localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(post); // إضافة المنشور الجديد في البداية
    localStorage.setItem('posts', JSON.stringify(posts));

    // مسح حقل الإدخال
    postInput.value = '';
}

// السماح بالنشر بضغط Enter
document.getElementById('postInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addPost();
    }
});
