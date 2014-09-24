my.shuidian = {
    addType: function (biao_name,biao_type,istotal,cb) {
        my.util.send('shuidian->addType', { biao_name: biao_name, biao_type: biao_type, istotal: istotal }, function (data) {
            if (data.status == 1) return my.view.message('请输入表名和表类别！');
            if (data.status == 2) return my.view.message('该类型的表已存在总表，请勿再添加总表！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editType: function (biao_type_id, biao_name, biao_type, istotal, cb) {
        my.util.send('shuidian->editType', { biao_type_id:biao_type_id,biao_name: biao_name, biao_type: biao_type, istotal: istotal }, function (data) {
            if (data.status == 1) return my.view.message('请输入表名和表类别！');
            if (data.status == 2) return my.view.message('该类型的表已存在总表，请勿再添加总表！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    delType: function (biao_type_id,cb) {
        my.util.send('shuidian->delType', { biao_type_id: biao_type_id }, function (data) {
            if (cb && typeof cb == 'function') cb();
        });
    },
    editBiao: function (arges,cb) {
        my.util.send('shuidian->editBiao', { biao_type_ids: arges.ids, store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status != 0) return my.view.message('配置水电表失败！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editPrice: function (arges, cb) {
        my.util.send('shuidian->editPrice', { list: arges.list, store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status == 1) return my.view.message('没有找到需要配置的表！');
            if (data.status == 2) return my.view.message('倍率至少为1倍！');
            if (data.status == 3) return my.view.message('单价必须大于0！');
            if (data.status == 4) return my.view.message('生效日期格式错误！');
            if (data.status == 5) return my.view.message('没有找到需要配置的表！');
            if (data.status != 0) return my.view.message('配置水电表参数失败！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editZhishu: function (arges,cb) {
        my.util.send('shuidian->editZhishu', { list: arges.list, usedate: arges.usedate || '', store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status == 1) return my.view.message('请录入至少一项数据！');
            if (data.status == 2) return my.view.message('表不存在！');
            if (data.status == 3) return my.view.message('表的单价和倍率未设置或录入日期早于生效日期，无法录入数据！');
            if (data.status == 4) return my.view.message('没有录入期初数据时，该日指数不能小于前一天的指数！');
            if (cb && typeof cb == 'function') cb();
        });

    }


}