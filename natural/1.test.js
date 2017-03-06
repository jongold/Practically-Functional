const { Right, Left } = require('../either');
const Task = require('data.task');

// nt(a.map(f)) == nt(a).map(f)
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of);

const fake = id =>
  ({ id, name: 'user1', best_friend_id: id + 1 });

const Db = ({
  find: id =>
    new Task((rej, res) =>
      setTimeout(() =>
        res(id > 2 ? Right(fake(id)) : Left('not found')),
        100)),
});

const send = (code, json) =>
  console.log(`sending ${code}: ${JSON.stringify(json)}`);

// Db.find(1) // Task(Either(User))
//   .chain(eu =>
//     eu.fold(e => Task.of(eu),
//             u => Db.find(u.best_friend_id)))
//   .fork(error => send(500, { error }),
//         eu => eu.fold(error => send(404, { error }),
//                       x => send(200, x)));

const findBestFriend = id =>
  Db.find(id) // Task(Either(User))
    .map(eitherToTask) // Task(User)
    .chain(u => Db.find(u.best_friend_id)) // Task(Either(User))
    // .chain(eitherToTask);

test('nt', (done) => {
  findBestFriend(1).fork(
    error => {
      log(error);
      // done();
    },
    user => {
      expect(user.id).toEqual(3)
      done();
    });
})
