const editBtns = document.querySelectorAll('.edit-btn');
const posts = document.querySelectorAll('.post');
const forms = document.querySelectorAll('.form');

for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener('click', () => {
        posts[i].classList.toggle('hide');
        forms[i].classList.toggle('hide');
        if (editBtns[i].textContent === 'Edit') {
            editBtns[i].textContent = 'Cancel';
        }
        else {
            editBtns[i].textContent = 'Edit';
        }

    });
}