import {
    Subscriber, observable, sandbox, action, runInAction, runInSandbox, SANDOBX_OPTION, SUBSCRIBE_OPTION,
    transacts, TRANSACTS_OPTION, computed, watch, Observer, RECORD_TYPE, MASK_ITERATE, MASK_UNDEFINED
} from '../../obb/js/obb';

import {
    Sibling,
    Children,
    NodeList
} from './siblings'


const enum CONTROL {
    ENTRY,
    SUBSCRIBER,
    SIBLING
}
type Entry = {
    v: any,
    k: string,
    i: number,
    t: any
}
type Control = {
    [CONTROL.ENTRY]: Entry,

    [CONTROL.SUBSCRIBER]: Subscriber,
    [CONTROL.SIBLING]: Sibling,
}

function entryStatement(object: any, body: Function) {
    if (!object) {
        return;
    }
    let newest_keys = Object.keys(object);
    let newest_values = Object.values(object);
    for (
        let index = 0, limit = newest_keys.length;
        index < limit;
        index++
    ) {
        body(newest_values[index], newest_keys[index], index, object);
    }
}

function nextIfSibling(
    parent: Sibling,
    test: Function,
    consequent: Function,
    alternate?: Function
) {
    let parent_subscriber = Subscriber.PARENT;
    let subscriber: Subscriber;
    watch(test, function (new_val: any, old_val: any) {
        let callback: Function;
        if (!subscriber || !new_val !== !old_val) {
            callback = new_val ? consequent : alternate;
            if (subscriber) {
                subscriber.unmount();
                parent.removeAllSibling();
            }
            subscriber = callback && new Subscriber(callback);
            subscriber && subscriber.mount(parent_subscriber);
        }
    }, true);

}

function nextEntrySibling(
    parent: Sibling,
    data: Function,
    callback: Function
) {
    let siblings: Array<Sibling>;
    if (parent) {
        parent.removeAllSibling();
        siblings = parent.siblings;
    }
    let target: any;


    let old_control_set: Array<Control> = [];
    let old_value_set: Array<any> = [];
    let old_key_set: Array<any> = [];
    let old_index_set: Array<any> = [];

    let new_control_set: Array<Control>;
    let new_value_set: Array<any>;
    let new_key_set: Array<any>;
    let new_index_set: Array<any>;


    let newest_keys: Array<any>;
    let newest_values: Array<any>;

    function addRecord(control: Control, value: any, key: string, index: number) {
        /*new_control_set.push(control);
        new_value_set.push(value);
        new_key_set.push(key);
        new_index_set.push(index);*/

        new_control_set[index] = control;
        new_value_set[index] = value;
        new_key_set[index] = key;
        new_index_set[index] = index;
    }
    function delRecord(index: number, length: number) {
        if (index === 0 && length === 1) {
            old_control_set.shift();
            old_value_set.shift();
            old_key_set.shift();
            old_index_set.shift();
            return;
        }
        old_control_set.splice(index, length);
        old_value_set.splice(index, length);
        old_key_set.splice(index, length);
        old_index_set.splice(index, length);
    }
    const reuse = action(
        function (_index: number, value: any, key: string, index: number) {
            //console.log("reuse", old_index_set[_index], value, key, index)
            let control = old_control_set[_index];
            let entry = control[CONTROL.ENTRY];

            addRecord(control, value, key, index);

            if (old_index_set[_index] !== index) {
                parent && control[CONTROL.SIBLING].moveTo(index);
                //console.log("index", _index, index);
                entry.i = index;

            }
            if (old_key_set[_index] !== key) {
                //console.log("key", bak_key_set[_index], key);
                entry.k = key;
            }
            if (old_value_set[_index] !== value) {
                //console.log("key", bak_value_set[_index], value);
                entry.v = value;
            }

        }
    );

    function destory(index: number) {
        let control = old_control_set[index];
        //console.log("destory", index, control)

        control[CONTROL.SUBSCRIBER].parent = subscriber.parent;
        control[CONTROL.SUBSCRIBER].unmount();

        parent && control[CONTROL.SIBLING].destory();
        //old_value_set[index] = old_key_set[index] = MARK_NOTUSED;

        delRecord(index, 1);

    }

    function add(value: any, key: string, index: number) {
        //console.log("add", value, key, index)
        let entry = observable({ v: value, k: key, i: index, t: target });

        let last_index = parent && siblings.length;


        /**
         * subscriber.parent
         * 使 _subscriber 只跟随上级订阅环境自动释放
         * 由当前订阅环境自有逻辑精确处理子订阅关系
         */
        let current_subscriber = new Subscriber(function () {
            callback(entry);
        }, SUBSCRIBE_OPTION.PREVENT_COLLECT).mount(subscriber.parent);
        /**
         * 能防止冗余的订阅回调
         */
        current_subscriber.parent = subscriber;

        let current_sibling = parent && siblings[last_index];

        addRecord(
            [entry, current_subscriber, current_sibling],
            value,
            key,
            index
        );

        parent && current_sibling.moveTo(index);
    }


    let subscriber = new Subscriber(
        function () {
            let brokens = subscriber.brokens;
            let accus = brokens.map(sub => sub.accu);
            target = getData(); //计算方法能穿透订阅，当内部有变更时当前订阅也会被回调

            newest_keys = [];
            newest_values = [];
            if (target !== null && target !== undefined) {
                let ob = Observer.TO_OB(target);
                if (ob) {   // 提高执行效率， 10000 个数据项 大概能提升10ms
                    let raw = ob.target;
                    ob.collect(MASK_ITERATE, RECORD_TYPE.OWN);
                    for (let key in raw) {
                        ob.collect(key, RECORD_TYPE.REF);
                        newest_keys.push(key);
                        newest_values.push(observable(raw[key]));
                    }
                } else {
                    newest_keys = Object.keys(target);
                    newest_values = Object.values(target);
                }
            }
            
            new_control_set = [];
            new_value_set = [];
            new_key_set = [];
            new_index_set = [];

            let t: any;
            let index = 0;
            let _index: number;
            let value: any;
            let key: string;
            let length = newest_values.length;
            while (index < length) {
                value = newest_values.shift();
                key = newest_keys.shift();
                if (old_value_set.length) {
                    /**
                     * 这里 value key index 中，其中两个因素确定结果的匹配
                     * 作用是尽可能的保持循环体内闭包环境的稳定性（不会因为数值差异过大而大量重新生成）
                     * 即是不需要给循环项绑定key（绑定key的方式仅是key与dom的确认关系，当key为下标时将没有意义）
                     * ，也能维持dom与数据稳定的一一确认关系
                     */
                    _index = old_value_set.indexOf(value);
                    if (_index < 0) {
                        _index = old_key_set.indexOf(key);
                        if (_index >= 0) {
                            t = old_value_set[_index];
                            if (
                                t && typeof t === "object"
                                && newest_values.includes(t)
                            ) {
                                _index = -1;
                            }
                        } else if (!newest_values.includes(old_value_set[0])) {
                            _index = 0;
                        }
                    } else if (
                        old_index_set[_index] !== index
                        && old_key_set[_index] !== key
                        && typeof value !== "object"
                    ) {
                        t = newest_keys.indexOf(old_key_set[_index]);
                        if (t >= 0 && newest_values[t] === old_value_set[_index]) {
                            _index = newest_values.includes(old_value_set[0]) ? -1 : 0;
                        }
                    }
                    if (_index >= 0) {
                        t = _index;

                        reuse(_index++, value, key, index++);
                        while (newest_values.length && _index < old_value_set.length) {
                            if (newest_values[0] === old_value_set[_index]) {
                                reuse(
                                    _index++,
                                    newest_values.shift(),
                                    newest_keys.shift(),
                                    index++
                                );
                            } else {
                                break;
                            }
                        }
                        delRecord(t, _index - t);
                        continue;
                    }
                }

                add(value, key, index++);
            }

            while (old_value_set.length) {
                destory(0);
            }

            old_control_set = new_control_set;
            old_value_set = new_value_set;
            old_key_set = new_key_set;
            old_index_set = new_index_set;

            for (let i = 0, sub: Subscriber; i < brokens.length; i++) {
                sub = brokens[i];
                if (
                    sub.accu === accus[i]
                    && sub.parent !== undefined
                    && !sub.is_run
                ) {
                    sub.update();
                }
            }
        }
    );
    let getData = computed(data, subscriber);
    subscriber.mount();
}
export {
    entryStatement,
    nextIfSibling,
    nextEntrySibling
}