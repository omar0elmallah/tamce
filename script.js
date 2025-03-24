function addPost() {
    // الحصول على نص المنشور من حقل الإدخال
    const postInput = document.getElementById('postInput');
    const postText = postInput.value.trim();

    if (postText === '') {
        alert('يرجى كتابة شيء للنشر!');
        return;
    }

    // إنشاء عنصر منشور جديد
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postContent = document.createElement('p');
    postContent.textContent = postText;

    const postTime = document.createElement('div');
    postTime.classList.add('time');
    postTime.textContent = new Date().toLocaleString('ar-EG');

    postDiv.appendChild(postContent);
    postDiv.appendChild(postTime);

    // إضافة المنشور إلى الحاوية
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.insertBefore(postDiv, postsContainer.firstChild);

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