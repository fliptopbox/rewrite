import u from '../../utilities/';

// this function needs to be bound to this context
// Dependancies:
// this.setState()
// this.getArticleByGuid()

function syncWithServer(username) {
    if (!username) {
        console.warn('Require sync profile id');
        return;
    }

    // sync with server
    // 1. does this user exist?
    // 2. get the remote articles
    // 3. compare the modified timestamps
    // 4. collect the articles that are newer thatn localStorage
    // 5. push the new or more recent records to the server
    //

    console.log('Sync with server [%s]', username);

    const fs = u.storage('articles');

    const localtimestamps = {};
    let localarticles = fs.updateArticlesData();
    let current = localarticles[0].uuid;

    localarticles.forEach(r => {
        localtimestamps[r.uuid] = r.modified || r.opened;
    });

    return fs
        .getUser(username)
        .then(json => {
            let meta, diff;
            if (json && json.settings) {
                u.storage('settings').write(json.settings);
            }

            current = (json.settings && json.settings.current) || current;

            for (let row in json) {
                if (/settings$/.test(row)) continue;
                meta = json[row].meta;
                meta.uuid = row;

                if (!localtimestamps[row]) {
                    console.log('Create local article [%s]', row);
                    u.storage(row).write(json[row]);
                    localarticles = localarticles.filter(r => r.uuid !== row);
                    localarticles.push(meta);
                    continue;
                }
                // there is a local version
                // compare timestamp and keep newset
                const local = u.storage(row).read();
                const remote = json[row];

                if (local > remote) {
                    console.warn('Replace remote data', row, username, diff);
                    fs.updateArticle(username, row, local);
                    continue;
                }

                //console.log('replacing local copy %s', row);
                u.storage(row).write(remote);
            }
        })
        .then(() => {
            this.getArticleByGuid(current);
        })

        .then(() => {
            localarticles = fs.updateArticlesData();
            this.setState({
                articles: localarticles,
                guid: username,
                current: current,
            });
        });
}

export default syncWithServer;
