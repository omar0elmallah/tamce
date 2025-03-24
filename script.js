// تحميل المنشورات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', loadPosts);

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('postsContainer');
    posts.forEach(post => {
        const postDiv = createPostElement(post);
        postsContainer.appendChild(postDiv);
    });
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postContent = document.createElement('p');
    postContent.textContent = post.text;

    const postTime = document.createElement('div');
    postTime.classList.add('time');
    postTime.textContent = post.time;

    // إضافة أزرار الإعجاب والتعليقات
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('post-actions');

    const likeButton = document.createElement('button');
    likeButton.textContent = 'إعجاب';
    const likesCount = document.createElement('span');
    likesCount.classList.add('likes-count');
    likesCount.textContent = ` (${post.likes || 0})`;
    likeButton.onclick = () => {
        post.likes = (post.likes || 0) + 1;
        likesCount.textContent = ` (${post.likes})`;
        updateLocalStorage();
        showNotification('تم الإعجاب بالمنشور');
    };

    const commentButton = document.createElement('button');
    commentButton.textContent = 'تعليق';

    // إضافة زر المشاركة
    const shareButton = document.createElement('button');
    shareButton.textContent = 'مشاركة';
    shareButton.onclick = () => {
        const sharedPost = {
            text: `تمت المشاركة: ${post.text}`,
            time: new Date().toLocaleString('ar-EG'),
            likes: 0,
            comments: []
        };
        const postsContainer = document.getElementById('postsContainer');
        const newPostDiv = createPostElement(sharedPost);
        postsContainer.insertBefore(newPostDiv, postsContainer.firstChild);
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift(sharedPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        showNotification('تمت مشاركة المنشور');
    };

    // إضافة زر التعديل
    const editButton = document.createElement('button');
    editButton.textContent = 'تعديل';
    editButton.onclick = () => {
        const newText = prompt('عدّل المنشور:', post.text);
        if (newText && newText.trim()) {
            post.text = newText.trim();
            postContent.textContent = post.text;
            updateLocalStorage();
            showNotification('تم تعديل المنشور');
        }
    };

    // إضافة زر الحذف
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'حذف';
    deleteButton.onclick = () => {
        if (confirm('هل تريد حذف هذا المنشور؟')) {
            postDiv.remove();
            updateLocalStorage();
            showNotification('تم حذف المنشور');
        }
    };

    actionsDiv.appendChild(likeButton);
    actionsDiv.appendChild(likesCount);
    actionsDiv.appendChild(commentButton);
    actionsDiv.appendChild(shareButton);
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    // حقل التعليقات
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentInput = document.createElement('input');
    commentInput.classList.add('comment-input');
    commentInput.placeholder = 'اكتب تعليقًا...';

    const commentsList = document.createElement('div');
    commentsList.classList.add('comments-list');
    if (post.comments) {
        post.comments.forEach(comment => {
            const commentP = document.createElement('p');
            commentP.classList.add('comment');
            commentP.textContent = comment;
            commentsList.appendChild(commentP);
        });
    }

    commentInput.onkeypress = (e) => {
        if (e.key === 'Enter' && commentInput.value.trim()) {
            const commentText = commentInput.value.trim();
            const commentP = document.createElement('p');
            commentP.classList.add('comment');
            commentP.textContent = commentText;
            commentsList.appendChild(commentP);
            post.comments = post.comments || [];
            post.comments.push(commentText);
            commentInput.value = '';
            updateLocalStorage();
            showNotification('تم إضافة تعليق');
        }
    };

    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentsList);

    // تجميع العناصر
    postDiv.appendChild(postContent);
    postDiv.appendChild(postTime);
    postDiv.appendChild(actionsDiv);
    postDiv.appendChild(commentSection);

    return postDiv;
}

function addPost() {
    const postInput = document.getElementById('postInput');
    const postText = postInput.value.trim();

    if (postText === '') {
        alert('يرجى كتابة شيء للنشر!');
        return;
    }

    const post = {
        text: postText,
        time: new Date().toLocaleString('ar-EG'),
        likes: 0,
        comments: []
    };

    // إضافة المنشور إلى الصفحة
    const postsContainer = document.getElementById('postsContainer');
    const postDiv = createPostElement(post);
    postsContainer.insertBefore(postDiv, postsContainer.firstChild);

    // حفظ المنشور في localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // مسح حقل الإدخال
    postInput.value = '';
    showNotification('تم نشر المنشور');
}

// تحديث localStorage بعد كل تغيير
function updateLocalStorage() {
    const posts = [];
    document.querySelectorAll('.post').forEach(postDiv => {
        const text = postDiv.querySelector('p').textContent;
        const time = postDiv.querySelector('.time').textContent;
        const likes = parseInt(postDiv.querySelector('.likes-count').textContent.match(/\d+/)?.[0] || 0);
        const comments = Array.from(postDiv.querySelectorAll('.comment')).map(c => c.textContent);
        posts.push({ text, time, likes, comments });
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// إضافة دالة الإشعارات
function showNotification(message) {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000); // الإشعار يختفي بعد ثانيتين
}

// السماح بالنشر بضغط Enter
document.getElementById('postInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addPost();
    }
});
