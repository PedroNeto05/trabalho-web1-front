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

function setPost(post: IPosts) {
  const div = document.createElement('div');
  const title = document.createElement('h3');
  const body = document.createElement('p');
  title.innerText = post.title;
  body.innerText = post.body;
  div.appendChild(title);
  div.appendChild(body);
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
  }

  createPost(postsJson);
}

window.addEventListener('load', getPosts);

titleInput.addEventListener('input', () => {
  errorDiv.innerHTML = '';
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
