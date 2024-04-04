const form = document.querySelector('form');
const postContainer = document.querySelector(
  '.posts-container',
) as HTMLDivElement;
const errorDiv = document.querySelector('.error') as HTMLDivElement;
const BASEURL = 'http://localhost:3333/posts';
const titleInput = document.querySelector(
  '.title-container input',
) as HTMLInputElement;
const bodyTextarea = document.querySelector(
  '.body-container textarea',
) as HTMLInputElement;

interface ISubmitPost {
  title: string;
  body: string;
}

interface IPosts {
  title: string;
  body: string;
  id: string;
}

function createDeleteButton() {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerText = '🗑️';
  return deleteButton;
}

function setPost(post: IPosts) {
  const div = document.createElement('div');
  const title = document.createElement('h3');
  const body = document.createElement('p');
  const divInvisível = document.createElement('div');
  divInvisível.classList.add('post-id');
  const divPost = document.createElement('div');
  divPost.classList.add('div-post');
  const divButtons = document.createElement('div');
  divButtons.classList.add('div-buttons');
  const deleteButton = createDeleteButton();
  title.innerText = post.title;
  body.innerText = post.body;
  divInvisível.innerText = post.id;

  divButtons.appendChild(deleteButton);
  divPost.appendChild(title);
  divPost.appendChild(body);
  divPost.appendChild(divInvisível);
  div.appendChild(divPost);
  div.appendChild(divButtons);
  postContainer.appendChild(div);
}

function createPost(postsJson: IPosts[]) {
  postContainer.innerHTML = '';
  postsJson.forEach(post => setPost(post));
}

async function getPosts() {
  const posts = await fetch(BASEURL);
  const postsJson = await posts.json();

  if (postsJson.length >= 1) {
    postContainer.style.display = 'block';
  } else {
    postContainer.style.display = 'none';
  }

  createPost(postsJson);
}

function setErrorMsg(error: string) {
  errorDiv.innerHTML = error;
}

async function submitPost(data: ISubmitPost) {
  const submitOptions: RequestInit = {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const submittedPosts = await fetch(BASEURL, submitOptions);
    if (submittedPosts.status === 400) {
      const error = await submittedPosts.json();

      setErrorMsg(error.message);
    }
  } catch (e) {
    console.log(e);
  }
}

async function deletePost(id: string) {
  const deleteOptions: RequestInit = {
    method: 'DELETE',
  };
  await fetch(`${BASEURL}/${id}`, deleteOptions);
  await getPosts();
}

window.addEventListener('load', getPosts);

titleInput.addEventListener('input', () => {
  errorDiv.innerHTML = '';
});

document.addEventListener('click', e => {
  /*
  
    Esses erros abaixo são do typescript, não achei outro jeito de fazer o delete do post e o método abaixo eu não consegui fazer a tipagem para que ele parrasse com esses erros

  */

  const { target } = e;
  if (target.classList.contains('delete-button')) {
    const deletedPost = target.parentElement.parentElement;
    const id = deletedPost.querySelector('.post-id').innerText;
    deletePost(id);
  }
});

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    title: titleInput.value,
    body: bodyTextarea.value,
  };
  await submitPost(data);

  setTimeout(getPosts, 1000);
});
