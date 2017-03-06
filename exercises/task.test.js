const Task = require('data.task');

describe('Task Exercises', () => {
  // SETUP
  // =========================
  const posts = { 1: { title: 'First' }, 2: { title: 'Second' } };

  const comments = { First: [{ id: 1, body: 'Brilliant!' }], Second: [{ id: 2, body: 'Unforgivable' }] };

  const getPost = id =>
    new Task((rej, res) =>
      setTimeout(() => posts[id] ? res(posts[id]) : rej('not found'), 200));

  const getComments = post =>
    new Task((rej, res) =>
      setTimeout(() => res(comments[post.title]), 200));

  // Exercise: Task
  // Goal: Refactor each example using Task
  // Bonus points: no curly braces

  // Ex1: Return the uppercased title of the post
  // =========================
  const postTitle = id =>
    getPost(id)
      .map(p => p.title)
      .map(t => t.toUpperCase());

  test('Ex1: postTitle', (done) => {
    postTitle(1)
    .fork(_ => done(), (t) => {
      expect(t).toBe('FIRST');
      done();
    });
  });

  // Ex2: pass in the post to getComments(), defined above, then
  // assign the returned comments to the post
  // =========================
  const commentsForPost = id =>
    getPost(id)
    .chain(post =>
      getComments(post)
        .map(cs => Object.assign({}, post, { comments: cs })));

  test('Ex2: commentsForPost', (done) => {
    commentsForPost(2)
    .fork(_ => done(), (t) => {
      expect(t.title).toBe('Second');
      expect(t.comments).toBe(comments.Second);
      done();
    });
  });


  // Ex3: Wrap __dirname in a Task to make it "pure"
  // =========================
  const getDirname = Task.of(__dirname); // wrap me in Task

  test('Ex3: getHref', (done) => {
    getDirname
    .fork(_ => done(), (t) => {
      expect(t).toContain('exercises');
      done();
    });
  });
});
