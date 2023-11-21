const GUN = require('gun');
const gun = GUN({
    // GUN configuration
});

// stress test with 1000 accounts
const Mock = require('mockjs');
const Random = Mock.Random;

for (let i = 0; i < 1000; i++) {
    const id = Random.guid();
    console.log(`Account ${i} created`);

    for (let j = 0; j < 10; j++) {
        const status = {
            created_at: Random.datetime(),
            content: Random.cparagraph(),
        };
        gun.get('account').get(id).get('post').get(j).put(status);
    }
}
console.log('1000 accounts created');

module.exports = gun;