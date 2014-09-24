my.chejian = {
    add: function (chejian_id,chejian_name,cb,fail) {
        my.util.send('chejian->add', { chejian_id: chejian_id, chejian_name: chejian_name }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    edit: function (id,chejian_id, chejian_name, cb, fail) {
        my.util.send('chejian->edit', { chejian_id: chejian_id, chejian_name: chejian_name,id:id }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    del: function (id,cb,fail) {
        my.util.send('chejian->del', { id: id }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    }
};