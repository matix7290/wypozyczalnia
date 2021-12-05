
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.42.4 */

    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    // (244:0) {#if componentParams}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    derived(loc, $loc => $loc.location);
    derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    function instance$5($$self, $$props, $$invalidate) {
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$5, create_fragment$a, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});
    	}
    }

    /* src/routes/Home.svelte generated by Svelte v3.42.4 */

    function create_fragment$9(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<h1>Home</h1>`;
    			attr(div, "id", "home");
    			attr(div, "class", "svelte-ozzypv");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (!mounted) {
    				dispose = listen(div, "load", loaded());
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    async function loaded() {
    	let data = new FormData();
    	data.append("name", "logged");
    	let URL = "./backend/GetSession.php";

    	let res = await fetch(URL, {
    		method: "POST",
    		body: data,
    		mode: "no-cors"
    	});

    	res = await res.json();

    	if (res === null) {
    		data = new FormData();
    		data.append("name", "logged");
    		data.append("value", false);
    		URL = "./backend/SetSession.php";

    		res = await fetch(URL, {
    			method: "POST",
    			body: data,
    			mode: "no-cors"
    		});

    		res = await res.json();
    	}
    }

    class Home extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$9, safe_not_equal, {});
    	}
    }

    /* src/routes/NotFound.svelte generated by Svelte v3.42.4 */

    function create_fragment$8(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<h1>404 - strona nie znaleziona!</h1>`;
    			attr(div, "id", "notFound");
    			attr(div, "class", "svelte-1i4ixy7");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    class NotFound extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$8, safe_not_equal, {});
    	}
    }

    async function getData(name) {
        let data = new FormData();
        data.append("name", name);

        let URL = "./backend/GetSession.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        return res;
    }

    /* src/components/Header.svelte generated by Svelte v3.42.4 */

    function create_else_block(ctx) {
    	let a0;
    	let t1;
    	let a1;

    	return {
    		c() {
    			a0 = element("a");
    			a0.innerHTML = `<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 mr-5 md:mt-0">Logowanie</button>`;
    			t1 = space();
    			a1 = element("a");
    			a1.innerHTML = `<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Rejestracja</button>`;
    			attr(a0, "href", "./#/Login");
    			attr(a1, "href", "./#/Register");
    		},
    		m(target, anchor) {
    			insert(target, a0, anchor);
    			insert(target, t1, anchor);
    			insert(target, a1, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(a0);
    			if (detaching) detach(t1);
    			if (detaching) detach(a1);
    		}
    	};
    }

    // (66:12) {#if logged}
    function create_if_block$1(ctx) {
    	let p;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			p = element("p");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Wyloguj";
    			attr(p, "class", "inline-flex items-center bg-gray-100 border-0 py-1 px-3 rounded text-base mt-4 mr-5 md:mt-0 select-none");
    			attr(p, "contenteditable", "false");
    			if (/*text*/ ctx[1] === void 0) add_render_callback(() => /*p_input_handler*/ ctx[4].call(p));
    			attr(button, "class", "inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 mr-5 md:mt-0");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);

    			if (/*text*/ ctx[1] !== void 0) {
    				p.innerHTML = /*text*/ ctx[1];
    			}

    			insert(target, t0, anchor);
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen(p, "input", /*p_input_handler*/ ctx[4]),
    					listen(button, "click", /*click_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*text*/ 2 && /*text*/ ctx[1] !== p.innerHTML) {
    				p.innerHTML = /*text*/ ctx[1];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    			if (detaching) detach(t0);
    			if (detaching) detach(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let header;
    	let div1;
    	let nav;
    	let t7;
    	let a4;
    	let t10;
    	let div0;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*logged*/ ctx[0]) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			header = element("header");
    			div1 = element("div");
    			nav = element("nav");

    			nav.innerHTML = `<a class="mr-5 hover:text-gray-900" href="./#/Display">Samochody</a> 
            <a class="mr-5 hover:text-gray-900" href="./#">Second Link</a> 
            <a class="mr-5 hover:text-gray-900" href="./#">Third Link</a> 
            <a class="hover:text-gray-900" href="./#">Fourth Link</a>`;

    			t7 = space();
    			a4 = element("a");

    			a4.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-green-500 rounded-full" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> 
            <span class="ml-3 text-xl">Tailblocks</span>`;

    			t10 = space();
    			div0 = element("div");
    			if_block.c();
    			attr(nav, "class", "flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto");
    			attr(a4, "class", "flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0");
    			attr(a4, "href", "./#");
    			attr(div0, "class", "lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0");
    			attr(div1, "class", "container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center");
    			attr(header, "class", "text-gray-600 body-font");
    		},
    		m(target, anchor) {
    			insert(target, header, anchor);
    			append(header, div1);
    			append(div1, nav);
    			append(div1, t7);
    			append(div1, a4);
    			append(div1, t10);
    			append(div1, div0);
    			if_block.m(div0, null);

    			if (!mounted) {
    				dispose = listen(header, "load", /*check*/ ctx[2]());
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(header);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let logged = false;
    	let text = "Witaj, ";

    	async function check() {
    		$$invalidate(0, logged = await getData("logged"));

    		if (logged) {
    			let firstname = await getData("firstname");
    			let lastname = await getData("lastname");
    			$$invalidate(1, text += firstname + " " + lastname);
    		}
    	}

    	async function logout() {
    		$$invalidate(0, logged = false);
    		let data = new FormData();
    		data.append("name", "logged");
    		data.append("value", false);
    		let URL = "./backend/SetSession.php";

    		let res = await fetch(URL, {
    			method: "POST",
    			body: data,
    			mode: "no-cors"
    		});

    		res = await res.json();
    	}

    	function p_input_handler() {
    		text = this.innerHTML;
    		$$invalidate(1, text);
    	}

    	const click_handler = () => {
    		logout();
    	};

    	return [logged, text, check, logout, p_input_handler, click_handler];
    }

    class Header extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$7, safe_not_equal, {});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.42.4 */

    function create_fragment$6(ctx) {
    	let footer;

    	return {
    		c() {
    			footer = element("footer");

    			footer.innerHTML = `<div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col"><div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left"><a href="#/" class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-green-500 rounded-full" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> 
                <span class="ml-3 text-xl">Auta</span></a> 
            <p class="mt-2 text-sm text-gray-500">Air plant banjo lyft occupy retro adaptogen indego</p></div> 
        <div class="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center"><div class="lg:w-1/4 md:w-1/2 w-full px-4"><h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2> 
                <nav class="list-none mb-10"><li><a href="#/" class="text-gray-600 hover:text-gray-800">First Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Second Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Third Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Fourth Link</a></li></nav></div> 
            <div class="lg:w-1/4 md:w-1/2 w-full px-4"><h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2> 
                <nav class="list-none mb-10"><li><a href="#/" class="text-gray-600 hover:text-gray-800">First Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Second Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Third Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Fourth Link</a></li></nav></div> 
            <div class="lg:w-1/4 md:w-1/2 w-full px-4"><h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2> 
                <nav class="list-none mb-10"><li><a href="#/" class="text-gray-600 hover:text-gray-800">First Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Second Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Third Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Fourth Link</a></li></nav></div> 
            <div class="lg:w-1/4 md:w-1/2 w-full px-4"><h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2> 
                <nav class="list-none mb-10"><li><a href="#/" class="text-gray-600 hover:text-gray-800">First Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Second Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Third Link</a></li> 
                    <li><a href="#/" class="text-gray-600 hover:text-gray-800">Fourth Link</a></li></nav></div></div></div> 
    <div class="bg-gray-100"><div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row"><p class="text-gray-500 text-sm text-center sm:text-left">© 2020 Tailblocks —
                <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a></p> 
            <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start"><a href="#/" class="text-gray-500"><svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a> 
                <a href="#/" class="ml-3 text-gray-500"><svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg></a> 
                <a href="#/" class="ml-3 text-gray-500"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg></a> 
                <a href="#/" class="ml-3 text-gray-500"><svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24"><path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="none"></circle></svg></a></span></div></div>`;

    			attr(footer, "class", "text-gray-600 body-font");
    		},
    		m(target, anchor) {
    			insert(target, footer, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(footer);
    		}
    	};
    }

    class Footer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$6, safe_not_equal, {});
    	}
    }

    /* src/Tailwindcss.svelte generated by Svelte v3.42.4 */

    class Tailwindcss extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, null, safe_not_equal, {});
    	}
    }

    /* src/routes/Display.svelte generated by Svelte v3.42.4 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[19] = list;
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (1:0) <script>     async function getItems() {         const URL = "./backend/Display.php";         let res = await fetch(URL);         res = await res.json();         return res;     }
    function create_catch_block(ctx) {
    	return { c: noop, m: noop, p: noop, d: noop };
    }

    // (156:20) {:then response}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*response*/ ctx[17];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*deleteItem, filtered, updateItem*/ 2) {
    				each_value = /*response*/ ctx[17];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (157:24) {#each response as item, i}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*i*/ ctx[20] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*item*/ ctx[18].mark + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*item*/ ctx[18].model + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*item*/ ctx[18].transmission + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*item*/ ctx[18].ac + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*item*/ ctx[18].afc + "l/km" + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*item*/ ctx[18].boot_capacity + "l" + "";
    	let t12;
    	let t13;
    	let td7;
    	let t14_value = /*item*/ ctx[18].number_of_doors + "";
    	let t14;
    	let t15;
    	let td8;
    	let t16_value = /*item*/ ctx[18].number_of_seats + "";
    	let t16;
    	let t17;
    	let td9;
    	let t18_value = /*item*/ ctx[18].vehicle_class + "";
    	let t18;
    	let t19;
    	let td10;
    	let t20_value = /*item*/ ctx[18].price + "";
    	let t20;
    	let t21;
    	let td11;
    	let t22_value = /*item*/ ctx[18].status_name + "";
    	let t22;
    	let t23;
    	let td12;
    	let button0;
    	let t25;
    	let td13;
    	let button1;
    	let t27;
    	let mounted;
    	let dispose;

    	function td1_input_handler() {
    		/*td1_input_handler*/ ctx[3].call(td1, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td2_input_handler() {
    		/*td2_input_handler*/ ctx[4].call(td2, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td3_input_handler() {
    		/*td3_input_handler*/ ctx[5].call(td3, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td4_input_handler() {
    		/*td4_input_handler*/ ctx[6].call(td4, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td5_input_handler() {
    		/*td5_input_handler*/ ctx[7].call(td5, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td6_input_handler() {
    		/*td6_input_handler*/ ctx[8].call(td6, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td7_input_handler() {
    		/*td7_input_handler*/ ctx[9].call(td7, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td8_input_handler() {
    		/*td8_input_handler*/ ctx[10].call(td8, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td9_input_handler() {
    		/*td9_input_handler*/ ctx[11].call(td9, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td10_input_handler() {
    		/*td10_input_handler*/ ctx[12].call(td10, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function td11_input_handler() {
    		/*td11_input_handler*/ ctx[13].call(td11, /*each_value*/ ctx[19], /*i*/ ctx[20]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[14](/*item*/ ctx[18]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[15](/*item*/ ctx[18]);
    	}

    	return {
    		c() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td8 = element("td");
    			t16 = text(t16_value);
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			td10 = element("td");
    			t20 = text(t20_value);
    			t21 = space();
    			td11 = element("td");
    			t22 = text(t22_value);
    			t23 = space();
    			td12 = element("td");
    			button0 = element("button");
    			button0.textContent = "Edytuj";
    			t25 = space();
    			td13 = element("td");
    			button1 = element("button");
    			button1.textContent = "Usuń";
    			t27 = space();
    			attr(td0, "class", "px-4 py-3");
    			attr(td1, "class", "px-4 py-3");
    			attr(td1, "contenteditable", "");
    			if (/*item*/ ctx[18].mark === void 0) add_render_callback(td1_input_handler);
    			attr(td2, "class", "px-4 py-3");
    			attr(td2, "contenteditable", "");
    			if (/*item*/ ctx[18].model === void 0) add_render_callback(td2_input_handler);
    			attr(td3, "class", "px-4 py-3");
    			attr(td3, "contenteditable", "");
    			if (/*item*/ ctx[18].transmission === void 0) add_render_callback(td3_input_handler);
    			attr(td4, "class", "px-4 py-3");
    			attr(td4, "contenteditable", "");
    			if (/*item*/ ctx[18].ac === void 0) add_render_callback(td4_input_handler);
    			attr(td5, "class", "px-4 py-3");
    			attr(td5, "contenteditable", "");
    			if (/*item*/ ctx[18].afc === void 0) add_render_callback(td5_input_handler);
    			attr(td6, "class", "px-4 py-3");
    			attr(td6, "contenteditable", "");
    			if (/*item*/ ctx[18].boot_capacity === void 0) add_render_callback(td6_input_handler);
    			attr(td7, "class", "px-4 py-3");
    			attr(td7, "contenteditable", "");
    			if (/*item*/ ctx[18].number_of_doors === void 0) add_render_callback(td7_input_handler);
    			attr(td8, "class", "px-4 py-3");
    			attr(td8, "contenteditable", "");
    			if (/*item*/ ctx[18].number_of_seats === void 0) add_render_callback(td8_input_handler);
    			attr(td9, "class", "px-4 py-3");
    			attr(td9, "contenteditable", "");
    			if (/*item*/ ctx[18].vehicle_class === void 0) add_render_callback(td9_input_handler);
    			attr(td10, "class", "px-4 py-3");
    			attr(td10, "contenteditable", "");
    			if (/*item*/ ctx[18].price === void 0) add_render_callback(td10_input_handler);
    			attr(td11, "class", "px-4 py-3");
    			attr(td11, "contenteditable", "");
    			if (/*item*/ ctx[18].status_name === void 0) add_render_callback(td11_input_handler);
    			set_style(button0, "border", "none");
    			attr(td12, "class", "px-4 py-3");
    			set_style(button1, "border", "none");
    			attr(td13, "class", "px-4 py-3");
    		},
    		m(target, anchor) {
    			insert(target, tr, anchor);
    			append(tr, td0);
    			append(td0, t0);
    			append(tr, t1);
    			append(tr, td1);
    			append(td1, t2);

    			if (/*item*/ ctx[18].mark !== void 0) {
    				td1.innerHTML = /*item*/ ctx[18].mark;
    			}

    			append(tr, t3);
    			append(tr, td2);
    			append(td2, t4);

    			if (/*item*/ ctx[18].model !== void 0) {
    				td2.innerHTML = /*item*/ ctx[18].model;
    			}

    			append(tr, t5);
    			append(tr, td3);
    			append(td3, t6);

    			if (/*item*/ ctx[18].transmission !== void 0) {
    				td3.innerHTML = /*item*/ ctx[18].transmission;
    			}

    			append(tr, t7);
    			append(tr, td4);
    			append(td4, t8);

    			if (/*item*/ ctx[18].ac !== void 0) {
    				td4.innerHTML = /*item*/ ctx[18].ac;
    			}

    			append(tr, t9);
    			append(tr, td5);
    			append(td5, t10);

    			if (/*item*/ ctx[18].afc !== void 0) {
    				td5.innerHTML = /*item*/ ctx[18].afc;
    			}

    			append(tr, t11);
    			append(tr, td6);
    			append(td6, t12);

    			if (/*item*/ ctx[18].boot_capacity !== void 0) {
    				td6.innerHTML = /*item*/ ctx[18].boot_capacity;
    			}

    			append(tr, t13);
    			append(tr, td7);
    			append(td7, t14);

    			if (/*item*/ ctx[18].number_of_doors !== void 0) {
    				td7.innerHTML = /*item*/ ctx[18].number_of_doors;
    			}

    			append(tr, t15);
    			append(tr, td8);
    			append(td8, t16);

    			if (/*item*/ ctx[18].number_of_seats !== void 0) {
    				td8.innerHTML = /*item*/ ctx[18].number_of_seats;
    			}

    			append(tr, t17);
    			append(tr, td9);
    			append(td9, t18);

    			if (/*item*/ ctx[18].vehicle_class !== void 0) {
    				td9.innerHTML = /*item*/ ctx[18].vehicle_class;
    			}

    			append(tr, t19);
    			append(tr, td10);
    			append(td10, t20);

    			if (/*item*/ ctx[18].price !== void 0) {
    				td10.innerHTML = /*item*/ ctx[18].price;
    			}

    			append(tr, t21);
    			append(tr, td11);
    			append(td11, t22);

    			if (/*item*/ ctx[18].status_name !== void 0) {
    				td11.innerHTML = /*item*/ ctx[18].status_name;
    			}

    			append(tr, t23);
    			append(tr, td12);
    			append(td12, button0);
    			append(tr, t25);
    			append(tr, td13);
    			append(td13, button1);
    			append(tr, t27);

    			if (!mounted) {
    				dispose = [
    					listen(td1, "input", td1_input_handler),
    					listen(td2, "input", td2_input_handler),
    					listen(td3, "input", td3_input_handler),
    					listen(td4, "input", td4_input_handler),
    					listen(td5, "input", td5_input_handler),
    					listen(td6, "input", td6_input_handler),
    					listen(td7, "input", td7_input_handler),
    					listen(td8, "input", td8_input_handler),
    					listen(td9, "input", td9_input_handler),
    					listen(td10, "input", td10_input_handler),
    					listen(td11, "input", td11_input_handler),
    					listen(button0, "click", click_handler),
    					listen(button1, "click", click_handler_1)
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*filtered*/ 2 && t2_value !== (t2_value = /*item*/ ctx[18].mark + "")) set_data(t2, t2_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].mark !== td1.innerHTML) {
    				td1.innerHTML = /*item*/ ctx[18].mark;
    			}

    			if (dirty & /*filtered*/ 2 && t4_value !== (t4_value = /*item*/ ctx[18].model + "")) set_data(t4, t4_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].model !== td2.innerHTML) {
    				td2.innerHTML = /*item*/ ctx[18].model;
    			}

    			if (dirty & /*filtered*/ 2 && t6_value !== (t6_value = /*item*/ ctx[18].transmission + "")) set_data(t6, t6_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].transmission !== td3.innerHTML) {
    				td3.innerHTML = /*item*/ ctx[18].transmission;
    			}

    			if (dirty & /*filtered*/ 2 && t8_value !== (t8_value = /*item*/ ctx[18].ac + "")) set_data(t8, t8_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].ac !== td4.innerHTML) {
    				td4.innerHTML = /*item*/ ctx[18].ac;
    			}

    			if (dirty & /*filtered*/ 2 && t10_value !== (t10_value = /*item*/ ctx[18].afc + "l/km" + "")) set_data(t10, t10_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].afc !== td5.innerHTML) {
    				td5.innerHTML = /*item*/ ctx[18].afc;
    			}

    			if (dirty & /*filtered*/ 2 && t12_value !== (t12_value = /*item*/ ctx[18].boot_capacity + "l" + "")) set_data(t12, t12_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].boot_capacity !== td6.innerHTML) {
    				td6.innerHTML = /*item*/ ctx[18].boot_capacity;
    			}

    			if (dirty & /*filtered*/ 2 && t14_value !== (t14_value = /*item*/ ctx[18].number_of_doors + "")) set_data(t14, t14_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].number_of_doors !== td7.innerHTML) {
    				td7.innerHTML = /*item*/ ctx[18].number_of_doors;
    			}

    			if (dirty & /*filtered*/ 2 && t16_value !== (t16_value = /*item*/ ctx[18].number_of_seats + "")) set_data(t16, t16_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].number_of_seats !== td8.innerHTML) {
    				td8.innerHTML = /*item*/ ctx[18].number_of_seats;
    			}

    			if (dirty & /*filtered*/ 2 && t18_value !== (t18_value = /*item*/ ctx[18].vehicle_class + "")) set_data(t18, t18_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].vehicle_class !== td9.innerHTML) {
    				td9.innerHTML = /*item*/ ctx[18].vehicle_class;
    			}

    			if (dirty & /*filtered*/ 2 && t20_value !== (t20_value = /*item*/ ctx[18].price + "")) set_data(t20, t20_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].price !== td10.innerHTML) {
    				td10.innerHTML = /*item*/ ctx[18].price;
    			}

    			if (dirty & /*filtered*/ 2 && t22_value !== (t22_value = /*item*/ ctx[18].status_name + "")) set_data(t22, t22_value);

    			if (dirty & /*filtered*/ 2 && /*item*/ ctx[18].status_name !== td11.innerHTML) {
    				td11.innerHTML = /*item*/ ctx[18].status_name;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (154:37)                          loading...                     {:then response}
    function create_pending_block(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("loading...");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let section;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let p1;
    	let input;
    	let t6;
    	let div1;
    	let table;
    	let thead;
    	let t34;
    	let tbody;
    	let promise;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 17
    	};

    	handle_promise(promise = /*filtered*/ ctx[1], info);

    	return {
    		c() {
    			section = element("section");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Dane z PHP";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Strona wyświetla dane pobrane z api PHP";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			p1 = element("p");
    			input = element("input");
    			t6 = space();
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");

    			thead.innerHTML = `<tr><th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Lp.</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Marka samochodu</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Model samochodu</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Skrzynia biegów [automatyczna/manualna]</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Klimatyzacja [automatyczna/manualna]</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Spalanie</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Pojemność bagażnika</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Liczba drzwi</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Liczba siedzeń</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Klasa pojazdu</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Cena</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Status</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Edytuj</th> 
                        <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Usuń</th></tr>`;

    			t34 = space();
    			tbody = element("tbody");
    			info.block.c();
    			attr(h1, "class", "sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900");
    			attr(p0, "class", "lg:w-2/3 mx-auto leading-relaxed text-base");
    			attr(input, "type", "text");
    			attr(p1, "class", "lg:w-2/3 mx-auto leading-relaxed text-base");
    			attr(div0, "class", "flex flex-col text-center w-full mb-20");
    			attr(table, "class", "table-auto w-full text-left whitespace-no-wrap");
    			attr(div1, "class", "lg:w-2/3 w-full mx-auto overflow-auto");
    			attr(div2, "class", "container px-5 py-24 mx-auto");
    			attr(section, "class", "text-gray-600 body-font");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div2);
    			append(div2, div0);
    			append(div0, h1);
    			append(div0, t1);
    			append(div0, p0);
    			append(div0, t3);
    			append(div0, br0);
    			append(div0, t4);
    			append(div0, br1);
    			append(div0, t5);
    			append(div0, p1);
    			append(p1, input);
    			set_input_value(input, /*phrase*/ ctx[0]);
    			append(div2, t6);
    			append(div2, div1);
    			append(div1, table);
    			append(table, thead);
    			append(table, t34);
    			append(table, tbody);
    			info.block.m(tbody, info.anchor = null);
    			info.mount = () => tbody;
    			info.anchor = null;

    			if (!mounted) {
    				dispose = listen(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*phrase*/ 1 && input.value !== /*phrase*/ ctx[0]) {
    				set_input_value(input, /*phrase*/ ctx[0]);
    			}

    			info.ctx = ctx;

    			if (dirty & /*filtered*/ 2 && promise !== (promise = /*filtered*/ ctx[1]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section);
    			info.block.d();
    			info.token = null;
    			info = null;
    			mounted = false;
    			dispose();
    		}
    	};
    }

    async function getItems() {
    	const URL = "./backend/Display.php";
    	let res = await fetch(URL);
    	res = await res.json();
    	return res;
    }

    async function deleteItem(id) {
    	const URL = "./backend/DeleteItem.php";
    	let data = new FormData();
    	data.append("id", id);

    	let res = await fetch(URL, {
    		method: "POST",
    		mode: "no-cors",
    		body: data
    	});

    	res = await res.json();
    	location.reload();
    }

    async function updateItem(item) {
    	let data = new FormData();
    	data.append("id", item.id);
    	data.append("mark", item.mark);
    	data.append("model", item.model);
    	data.append("transmission", item.transmission);
    	data.append("as", item.as);
    	data.append("number_of_seats", item.number_of_seats);
    	data.append("afc", item.afc);
    	data.append("boot_capacity", item.boot_capacity);
    	data.append("number_of_doors", item.number_of_doors);

    	// let res = await fetch(URL, {
    	//     method: "POST",
    	//     mode: "no-cors",
    	//     body: data,
    	// });
    	// res = await res.json();
    	// location.reload();
    	console.log(data.values());
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let filtered;
    	let items = getItems();
    	let phrase = "";

    	function input_input_handler() {
    		phrase = this.value;
    		$$invalidate(0, phrase);
    	}

    	function td1_input_handler(each_value, i) {
    		each_value[i].mark = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td2_input_handler(each_value, i) {
    		each_value[i].model = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td3_input_handler(each_value, i) {
    		each_value[i].transmission = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td4_input_handler(each_value, i) {
    		each_value[i].ac = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td5_input_handler(each_value, i) {
    		each_value[i].afc = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td6_input_handler(each_value, i) {
    		each_value[i].boot_capacity = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td7_input_handler(each_value, i) {
    		each_value[i].number_of_doors = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td8_input_handler(each_value, i) {
    		each_value[i].number_of_seats = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td9_input_handler(each_value, i) {
    		each_value[i].vehicle_class = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td10_input_handler(each_value, i) {
    		each_value[i].price = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	function td11_input_handler(each_value, i) {
    		each_value[i].status_name = this.innerHTML;
    		(($$invalidate(1, filtered), $$invalidate(16, items)), $$invalidate(0, phrase));
    	}

    	const click_handler = item => {
    		updateItem(item);
    	};

    	const click_handler_1 = item => {
    		deleteItem(item.id);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*phrase*/ 1) {
    			$$invalidate(1, filtered = items.then(r => r.filter(item => {
    				return [
    					item.id,
    					item.mark,
    					item.model,
    					item.transmission,
    					item.as,
    					item.number_of_seats,
    					item.afc,
    					item.boot_capacity,
    					item.number_of_doors
    				].some(element => element.toString().toLowerCase().includes(phrase.toString().toLowerCase()));
    			})));
    		}
    	};

    	return [
    		phrase,
    		filtered,
    		input_input_handler,
    		td1_input_handler,
    		td2_input_handler,
    		td3_input_handler,
    		td4_input_handler,
    		td5_input_handler,
    		td6_input_handler,
    		td7_input_handler,
    		td8_input_handler,
    		td9_input_handler,
    		td10_input_handler,
    		td11_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Display extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src/routes/AddItem.svelte generated by Svelte v3.42.4 */

    function create_if_block(ctx) {
    	let p;
    	let t;

    	return {
    		c() {
    			p = element("p");
    			t = text(/*message*/ ctx[5]);
    			attr(p, "class", "bg-green-400 text-white ");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*message*/ 32) set_data(t, /*message*/ ctx[5]);
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let t3;
    	let input4;
    	let t4;
    	let button;
    	let t6;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*message*/ ctx[5] && create_if_block(ctx);

    	return {
    		c() {
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			t3 = space();
    			input4 = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Dodaj";
    			t6 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr(input0, "type", "text");
    			attr(input0, "placeholder", "marka");
    			attr(input1, "type", "text");
    			attr(input1, "placeholder", "model");
    			attr(input2, "type", "text");
    			attr(input2, "placeholder", "rok");
    			attr(input3, "type", "text");
    			attr(input3, "placeholder", "kolor");
    			attr(input4, "type", "text");
    			attr(input4, "placeholder", "stan");
    		},
    		m(target, anchor) {
    			insert(target, input0, anchor);
    			set_input_value(input0, /*marka*/ ctx[0]);
    			insert(target, t0, anchor);
    			insert(target, input1, anchor);
    			set_input_value(input1, /*model*/ ctx[1]);
    			insert(target, t1, anchor);
    			insert(target, input2, anchor);
    			set_input_value(input2, /*rok*/ ctx[2]);
    			insert(target, t2, anchor);
    			insert(target, input3, anchor);
    			set_input_value(input3, /*kolor*/ ctx[3]);
    			insert(target, t3, anchor);
    			insert(target, input4, anchor);
    			set_input_value(input4, /*stan*/ ctx[4]);
    			insert(target, t4, anchor);
    			insert(target, button, anchor);
    			insert(target, t6, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen(input2, "input", /*input2_input_handler*/ ctx[9]),
    					listen(input3, "input", /*input3_input_handler*/ ctx[10]),
    					listen(input4, "input", /*input4_input_handler*/ ctx[11]),
    					listen(button, "click", /*dodajElement*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*marka*/ 1 && input0.value !== /*marka*/ ctx[0]) {
    				set_input_value(input0, /*marka*/ ctx[0]);
    			}

    			if (dirty & /*model*/ 2 && input1.value !== /*model*/ ctx[1]) {
    				set_input_value(input1, /*model*/ ctx[1]);
    			}

    			if (dirty & /*rok*/ 4 && input2.value !== /*rok*/ ctx[2]) {
    				set_input_value(input2, /*rok*/ ctx[2]);
    			}

    			if (dirty & /*kolor*/ 8 && input3.value !== /*kolor*/ ctx[3]) {
    				set_input_value(input3, /*kolor*/ ctx[3]);
    			}

    			if (dirty & /*stan*/ 16 && input4.value !== /*stan*/ ctx[4]) {
    				set_input_value(input4, /*stan*/ ctx[4]);
    			}

    			if (/*message*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input0);
    			if (detaching) detach(t0);
    			if (detaching) detach(input1);
    			if (detaching) detach(t1);
    			if (detaching) detach(input2);
    			if (detaching) detach(t2);
    			if (detaching) detach(input3);
    			if (detaching) detach(t3);
    			if (detaching) detach(input4);
    			if (detaching) detach(t4);
    			if (detaching) detach(button);
    			if (detaching) detach(t6);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let marka, model, rok, kolor, stan, message;

    	async function dodajElement() {
    		if (marka && model && rok && kolor && stan) {
    			console.log(marka, model, rok, kolor, stan);
    			let data = new FormData();
    			data.append("marka", marka);
    			data.append("model", model);
    			data.append("rok", rok);
    			data.append("kolor", kolor);
    			data.append("stan", stan);

    			// const URL = "http://localhost/stuglik/public/backend/AddItem.php";
    			const URL = "./backend/AddItem.php";

    			let res = await fetch(URL, {
    				method: "POST",
    				body: data,
    				mode: "no-cors"
    			});

    			res = await res.json();
    			$$invalidate(5, message = res.msg);
    			console.log(res.msg);
    		} else {
    			alert("Nie uzupełniłeś wszystkiego!");
    		}
    	}

    	function input0_input_handler() {
    		marka = this.value;
    		$$invalidate(0, marka);
    	}

    	function input1_input_handler() {
    		model = this.value;
    		$$invalidate(1, model);
    	}

    	function input2_input_handler() {
    		rok = this.value;
    		$$invalidate(2, rok);
    	}

    	function input3_input_handler() {
    		kolor = this.value;
    		$$invalidate(3, kolor);
    	}

    	function input4_input_handler() {
    		stan = this.value;
    		$$invalidate(4, stan);
    	}

    	return [
    		marka,
    		model,
    		rok,
    		kolor,
    		stan,
    		message,
    		dodajElement,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
    	];
    }

    class AddItem extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* src/routes/test.svelte generated by Svelte v3.42.4 */

    function create_fragment$3(ctx) {
    	let section;

    	return {
    		c() {
    			section = element("section");

    			section.innerHTML = `<div class="container px-5 py-24 mx-auto"><div class="flex flex-col text-center w-full mb-12"><h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1> 
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
                gentrify.</p></div> 
        <div class="lg:w-1/2 md:w-2/3 mx-auto"><div class="flex flex-wrap -m-2"><div class="p-2 w-1/2"><div class="relative"><label for="name" class="leading-7 text-sm text-gray-600">Name</label> 
                        <input type="text" id="name" name="name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/></div></div> 
                <div class="p-2 w-1/2"><div class="relative"><label for="email" class="leading-7 text-sm text-gray-600">Email</label> 
                        <input type="email" id="email" name="email" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/></div></div> 
                <div class="p-2 w-full"><div class="relative"><label for="message" class="leading-7 text-sm text-gray-600">Message</label> 
                        <textarea id="message" name="message" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea></div></div> 
                <div class="p-2 w-full"><button class="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg">Button</button></div></div></div></div>`;

    			attr(section, "class", "text-gray-600 body-font relative");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section);
    		}
    	};
    }

    class Test extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$3, safe_not_equal, {});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*
     * JavaScript MD5
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * https://opensource.org/licenses/MIT
     *
     * Based on
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    var md5 = createCommonjsModule(function (module) {
     (function ($) {

      /**
       * Add integers, wrapping at 2^32.
       * This uses 16-bit operations internally to work around bugs in interpreters.
       *
       * @param {number} x First integer
       * @param {number} y Second integer
       * @returns {number} Sum
       */
      function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff)
      }

      /**
       * Bitwise rotate a 32-bit number to the left.
       *
       * @param {number} num 32-bit number
       * @param {number} cnt Rotation count
       * @returns {number} Rotated number
       */
      function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
      }

      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} q q
       * @param {number} a a
       * @param {number} b b
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
      }

      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       *
       * @param {Array} x Array of little-endian words
       * @param {number} len Bit length
       * @returns {Array<number>} MD5 Array
       */
      function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
        }
        return [a, b, c, d]
      }

      /**
       * Convert an array of little-endian words to a string
       *
       * @param {Array<number>} input MD5 Array
       * @returns {string} MD5 string
       */
      function binl2rstr(input) {
        var i;
        var output = '';
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
        }
        return output
      }

      /**
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       *
       * @param {string} input Raw input string
       * @returns {Array<number>} Array of little-endian words
       */
      function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
        }
        return output
      }

      /**
       * Calculate the MD5 of a raw string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
      }

      /**
       * Calculates the HMAC-MD5 of a key and some data (raw strings)
       *
       * @param {string} key HMAC key
       * @param {string} data Raw input string
       * @returns {string} Raw MD5 string
       */
      function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5c5c5c5c;
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
      }

      /**
       * Convert a raw string to a hex string
       *
       * @param {string} input Raw input string
       * @returns {string} Hex encoded string
       */
      function rstr2hex(input) {
        var hexTab = '0123456789abcdef';
        var output = '';
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
        }
        return output
      }

      /**
       * Encode a string as UTF-8
       *
       * @param {string} input Input string
       * @returns {string} UTF8 string
       */
      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
      }

      /**
       * Encodes input string as raw MD5 string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
      }
      /**
       * Encodes input string as Hex encoded string
       *
       * @param {string} s Input string
       * @returns {string} Hex encoded string
       */
      function hexMD5(s) {
        return rstr2hex(rawMD5(s))
      }
      /**
       * Calculates the raw HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
      }
      /**
       * Calculates the Hex encoded HMAC-MD5 for the given key and data
       *
       * @param {string} k HMAC key
       * @param {string} d Input string
       * @returns {string} Raw MD5 string
       */
      function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
      }

      /**
       * Calculates MD5 value for a given string.
       * If a key is provided, calculates the HMAC-MD5 value.
       * Returns a Hex encoded string unless the raw argument is given.
       *
       * @param {string} string Input string
       * @param {string} [key] HMAC key
       * @param {boolean} [raw] Raw output switch
       * @returns {string} MD5 output
       */
      function md5(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hexMD5(string)
          }
          return rawMD5(string)
        }
        if (!raw) {
          return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
      }

      if (module.exports) {
        module.exports = md5;
      } else {
        $.md5 = md5;
      }
    })(commonjsGlobal);
    });

    async function checkLog() {
        let data = new FormData();
        data.append("name", "logged");

        let URL = "./backend/GetSession.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        if (res) {
            window.location.replace("./#");
        }
    }

    /* src/routes/Register.svelte generated by Svelte v3.42.4 */

    function create_fragment$2(ctx) {
    	let section;
    	let div20;
    	let div0;
    	let t3;
    	let div19;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div3;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let p1;
    	let t13;
    	let p2;
    	let t15;
    	let div4;
    	let label3;
    	let t17;
    	let input3;
    	let t18;
    	let div5;
    	let label4;
    	let t20;
    	let input4;
    	let t21;
    	let div6;
    	let label5;
    	let t23;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t29;
    	let p3;
    	let t31;
    	let div7;
    	let label6;
    	let t33;
    	let input5;
    	let t34;
    	let div8;
    	let label7;
    	let t36;
    	let input6;
    	let t37;
    	let div9;
    	let label8;
    	let t39;
    	let input7;
    	let t40;
    	let div10;
    	let label9;
    	let t42;
    	let input8;
    	let t43;
    	let div11;
    	let label10;
    	let t45;
    	let input9;
    	let t46;
    	let p4;
    	let t48;
    	let div12;
    	let label11;
    	let t50;
    	let input10;
    	let t51;
    	let div13;
    	let label12;
    	let t53;
    	let input11;
    	let t54;
    	let p5;
    	let t56;
    	let div14;
    	let label13;
    	let t58;
    	let input12;
    	let t59;
    	let div15;
    	let label14;
    	let t61;
    	let input13;
    	let t62;
    	let div16;
    	let label15;
    	let t64;
    	let input14;
    	let t65;
    	let div17;
    	let label16;
    	let t67;
    	let input15;
    	let t68;
    	let div18;
    	let label17;
    	let t70;
    	let input16;
    	let t71;
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			section = element("section");
    			div20 = element("div");
    			div0 = element("div");

    			div0.innerHTML = `<h1 class="title-font font-medium text-3xl text-gray-900">Zarejestruj się...</h1> 
            <p class="leading-relaxed mt-4">...a nie pomyślisz już nigdy o zakupie samochodu.</p>`;

    			t3 = space();
    			div19 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Nazwa użytkownika";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Hasło";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Potwierdź hasło";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			p1 = element("p");
    			t13 = space();
    			p2 = element("p");
    			p2.textContent = "Informacje o użytkowniku";
    			t15 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Imię";
    			t17 = space();
    			input3 = element("input");
    			t18 = space();
    			div5 = element("div");
    			label4 = element("label");
    			label4.textContent = "Nazwisko";
    			t20 = space();
    			input4 = element("input");
    			t21 = space();
    			div6 = element("div");
    			label5 = element("label");
    			label5.textContent = "Wiek";
    			t23 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "18";
    			option1 = element("option");
    			option1.textContent = "19";
    			option2 = element("option");
    			option2.textContent = "20";
    			option3 = element("option");
    			option3.textContent = "21";
    			option4 = element("option");
    			option4.textContent = "więcej niż 21";
    			t29 = space();
    			p3 = element("p");
    			p3.textContent = "Adres";
    			t31 = space();
    			div7 = element("div");
    			label6 = element("label");
    			label6.textContent = "Ulica";
    			t33 = space();
    			input5 = element("input");
    			t34 = space();
    			div8 = element("div");
    			label7 = element("label");
    			label7.textContent = "Numer domu";
    			t36 = space();
    			input6 = element("input");
    			t37 = space();
    			div9 = element("div");
    			label8 = element("label");
    			label8.textContent = "Numer mieszkania";
    			t39 = space();
    			input7 = element("input");
    			t40 = space();
    			div10 = element("div");
    			label9 = element("label");
    			label9.textContent = "Miasto";
    			t42 = space();
    			input8 = element("input");
    			t43 = space();
    			div11 = element("div");
    			label10 = element("label");
    			label10.textContent = "Kod pocztowy";
    			t45 = space();
    			input9 = element("input");
    			t46 = space();
    			p4 = element("p");
    			p4.textContent = "Dane kontaktowe";
    			t48 = space();
    			div12 = element("div");
    			label11 = element("label");
    			label11.textContent = "Email";
    			t50 = space();
    			input10 = element("input");
    			t51 = space();
    			div13 = element("div");
    			label12 = element("label");
    			label12.textContent = "Numer telefonu";
    			t53 = space();
    			input11 = element("input");
    			t54 = space();
    			p5 = element("p");
    			p5.textContent = "Dane rozliczeniowe";
    			t56 = space();
    			div14 = element("div");
    			label13 = element("label");
    			label13.textContent = "Imię właściciela karty";
    			t58 = space();
    			input12 = element("input");
    			t59 = space();
    			div15 = element("div");
    			label14 = element("label");
    			label14.textContent = "Nazwisko właściciela karty";
    			t61 = space();
    			input13 = element("input");
    			t62 = space();
    			div16 = element("div");
    			label15 = element("label");
    			label15.textContent = "Numer karty";
    			t64 = space();
    			input14 = element("input");
    			t65 = space();
    			div17 = element("div");
    			label16 = element("label");
    			label16.textContent = "Data ważności";
    			t67 = space();
    			input15 = element("input");
    			t68 = space();
    			div18 = element("div");
    			label17 = element("label");
    			label17.textContent = "CCV2";
    			t70 = space();
    			input16 = element("input");
    			t71 = space();
    			button = element("button");
    			button.textContent = "Zarejestruj";
    			attr(div0, "class", "w-1/4 mb-10 pr-0 flex flex-col items-start");
    			attr(label0, "for", "username");
    			attr(label0, "class", "leading-7 text-sm text-gray-600");
    			attr(input0, "type", "text");
    			attr(input0, "id", "username");
    			attr(input0, "name", "username");
    			attr(input0, "placeholder", "jan_kowalski");
    			attr(input0, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div1, "class", "relative mb-4");
    			attr(label1, "for", "password");
    			attr(label1, "class", "leading-7 text-sm text-gray-600");
    			attr(input1, "type", "password");
    			attr(input1, "id", "password");
    			attr(input1, "name", "password");
    			attr(input1, "placeholder", "12345678");
    			attr(input1, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div2, "class", "relative mb-4");
    			attr(label2, "for", "confirm_password");
    			attr(label2, "class", "leading-7 text-sm text-gray-600");
    			attr(input2, "type", "password");
    			attr(input2, "id", "confirm_password");
    			attr(input2, "name", "confirm_password");
    			attr(input2, "placeholder", "12345678");
    			attr(input2, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(p1, "id", "message");
    			attr(p1, "class", "text-xs mt-3 text-red-600");
    			attr(div3, "class", "relative mb-4");
    			attr(p2, "class", "text-s mb-3 text-gray-600");
    			attr(label3, "for", "firstname");
    			attr(label3, "class", "leading-7 text-sm text-gray-600");
    			attr(input3, "type", "text");
    			attr(input3, "id", "firstname");
    			attr(input3, "name", "firstname");
    			attr(input3, "placeholder", "Jan");
    			attr(input3, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div4, "class", "relative mb-4");
    			attr(label4, "for", "lastname");
    			attr(label4, "class", "leading-7 text-sm text-gray-600");
    			attr(input4, "type", "text");
    			attr(input4, "id", "lastname");
    			attr(input4, "name", "lastname");
    			attr(input4, "placeholder", "Kowalski");
    			attr(input4, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div5, "class", "relative mb-4");
    			attr(label5, "for", "age");
    			attr(label5, "class", "leading-7 text-sm text-gray-600");
    			option0.__value = "18";
    			option0.value = option0.__value;
    			option1.__value = "19";
    			option1.value = option1.__value;
    			option2.__value = "20";
    			option2.value = option2.__value;
    			option3.__value = "21";
    			option3.value = option3.__value;
    			option4.__value = "more";
    			option4.value = option4.__value;
    			attr(select, "id", "age");
    			attr(select, "name", "age");
    			attr(select, "class", "w-full h-11 bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			if (/*user_info*/ ctx[0].age === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			attr(div6, "class", "relative mb-4");
    			attr(p3, "class", "text-s mb-3 text-gray-600");
    			attr(label6, "for", "street");
    			attr(label6, "class", "leading-7 text-sm text-gray-600");
    			attr(input5, "type", "text");
    			attr(input5, "id", "street");
    			attr(input5, "name", "street");
    			attr(input5, "placeholder", "Świętokrzyska");
    			attr(input5, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div7, "class", "relative mb-4");
    			attr(label7, "for", "house_number");
    			attr(label7, "class", "leading-7 text-sm text-gray-600");
    			attr(input6, "type", "text");
    			attr(input6, "id", "house_number");
    			attr(input6, "name", "house_number");
    			attr(input6, "placeholder", "21");
    			attr(input6, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div8, "class", "relative mb-4");
    			attr(label8, "for", "apartment_number");
    			attr(label8, "class", "leading-7 text-sm text-gray-600");
    			attr(input7, "type", "text");
    			attr(input7, "id", "apartment_number");
    			attr(input7, "name", "apartment_number");
    			attr(input7, "placeholder", "37");
    			attr(input7, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div9, "class", "relative mb-4");
    			attr(label9, "for", "city");
    			attr(label9, "class", "leading-7 text-sm text-gray-600");
    			attr(input8, "type", "text");
    			attr(input8, "id", "city");
    			attr(input8, "name", "city");
    			attr(input8, "placeholder", "Kraków");
    			attr(input8, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div10, "class", "relative mb-4");
    			attr(label10, "for", "postcode");
    			attr(label10, "class", "leading-7 text-sm text-gray-600");
    			attr(input9, "type", "text");
    			attr(input9, "id", "postcode");
    			attr(input9, "name", "postcode");
    			attr(input9, "placeholder", "31-131");
    			attr(input9, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div11, "class", "relative mb-4");
    			attr(p4, "class", "text-s mb-3 text-gray-600");
    			attr(label11, "for", "email");
    			attr(label11, "class", "leading-7 text-sm text-gray-600");
    			attr(input10, "type", "email");
    			attr(input10, "id", "email");
    			attr(input10, "name", "email");
    			attr(input10, "placeholder", "jan.kowalski@poczta.pl");
    			attr(input10, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div12, "class", "relative mb-4");
    			attr(label12, "for", "phone");
    			attr(label12, "class", "leading-7 text-sm text-gray-600");
    			attr(input11, "type", "tel");
    			attr(input11, "id", "phone");
    			attr(input11, "name", "phone");
    			attr(input11, "placeholder", "123456789");
    			attr(input11, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div13, "class", "relative mb-4");
    			attr(p5, "class", "text-s mb-3 text-gray-600");
    			attr(label13, "for", "owner_firstname");
    			attr(label13, "class", "leading-7 text-sm text-gray-600");
    			attr(input12, "type", "text");
    			attr(input12, "id", "owner_firstname");
    			attr(input12, "name", "owner_firstname");
    			attr(input12, "placeholder", "Jan");
    			attr(input12, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div14, "class", "relative mb-4");
    			attr(label14, "for", "owner_lastname");
    			attr(label14, "class", "leading-7 text-sm text-gray-600");
    			attr(input13, "type", "text");
    			attr(input13, "id", "owner_lastname");
    			attr(input13, "name", "owner_lastname");
    			attr(input13, "placeholder", "Kowalski");
    			attr(input13, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div15, "class", "relative mb-4");
    			attr(label15, "for", "card_number");
    			attr(label15, "class", "leading-7 text-sm text-gray-600");
    			attr(input14, "type", "text");
    			attr(input14, "id", "card_number");
    			attr(input14, "name", "card_number");
    			attr(input14, "placeholder", "1234 5678 1234 5678");
    			attr(input14, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div16, "class", "relative mb-4");
    			attr(label16, "for", "expiry_date");
    			attr(label16, "class", "leading-7 text-sm text-gray-600");
    			attr(input15, "type", "text");
    			attr(input15, "id", "expiry_date");
    			attr(input15, "name", "expiry_date");
    			attr(input15, "placeholder", "12/23");
    			attr(input15, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div17, "class", "relative mb-4");
    			attr(label17, "for", "cvv2");
    			attr(label17, "class", "leading-7 text-sm text-gray-600");
    			attr(input16, "type", "text");
    			attr(input16, "id", "cvv2");
    			attr(input16, "name", "cvv2");
    			attr(input16, "placeholder", "123");
    			attr(input16, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div18, "class", "relative mb-4");
    			attr(button, "class", "text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg");
    			attr(div19, "class", "bg-gray-100 rounded-lg p-8 flex flex-col w-2/3 mt-10 md:mt-0 self-center");
    			attr(div20, "class", "container px-5 py-24 mx-auto flex flex-wrap flex-col items-center");
    			attr(section, "class", "text-gray-600 body-font");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div20);
    			append(div20, div0);
    			append(div20, t3);
    			append(div20, div19);
    			append(div19, div1);
    			append(div1, label0);
    			append(div1, t5);
    			append(div1, input0);
    			set_input_value(input0, /*user_info*/ ctx[0].username);
    			append(div19, t6);
    			append(div19, div2);
    			append(div2, label1);
    			append(div2, t8);
    			append(div2, input1);
    			set_input_value(input1, /*user_info*/ ctx[0].password);
    			append(div19, t9);
    			append(div19, div3);
    			append(div3, label2);
    			append(div3, t11);
    			append(div3, input2);
    			set_input_value(input2, /*user_info*/ ctx[0].confirm);
    			append(div3, t12);
    			append(div3, p1);
    			append(div19, t13);
    			append(div19, p2);
    			append(div19, t15);
    			append(div19, div4);
    			append(div4, label3);
    			append(div4, t17);
    			append(div4, input3);
    			set_input_value(input3, /*user_info*/ ctx[0].firstname);
    			append(div19, t18);
    			append(div19, div5);
    			append(div5, label4);
    			append(div5, t20);
    			append(div5, input4);
    			set_input_value(input4, /*user_info*/ ctx[0].lastname);
    			append(div19, t21);
    			append(div19, div6);
    			append(div6, label5);
    			append(div6, t23);
    			append(div6, select);
    			append(select, option0);
    			append(select, option1);
    			append(select, option2);
    			append(select, option3);
    			append(select, option4);
    			select_option(select, /*user_info*/ ctx[0].age);
    			append(div19, t29);
    			append(div19, p3);
    			append(div19, t31);
    			append(div19, div7);
    			append(div7, label6);
    			append(div7, t33);
    			append(div7, input5);
    			set_input_value(input5, /*user_info*/ ctx[0].street);
    			append(div19, t34);
    			append(div19, div8);
    			append(div8, label7);
    			append(div8, t36);
    			append(div8, input6);
    			set_input_value(input6, /*user_info*/ ctx[0].house_number);
    			append(div19, t37);
    			append(div19, div9);
    			append(div9, label8);
    			append(div9, t39);
    			append(div9, input7);
    			set_input_value(input7, /*user_info*/ ctx[0].apartment_number);
    			append(div19, t40);
    			append(div19, div10);
    			append(div10, label9);
    			append(div10, t42);
    			append(div10, input8);
    			set_input_value(input8, /*user_info*/ ctx[0].city);
    			append(div19, t43);
    			append(div19, div11);
    			append(div11, label10);
    			append(div11, t45);
    			append(div11, input9);
    			set_input_value(input9, /*user_info*/ ctx[0].postcode);
    			append(div19, t46);
    			append(div19, p4);
    			append(div19, t48);
    			append(div19, div12);
    			append(div12, label11);
    			append(div12, t50);
    			append(div12, input10);
    			set_input_value(input10, /*user_info*/ ctx[0].email);
    			append(div19, t51);
    			append(div19, div13);
    			append(div13, label12);
    			append(div13, t53);
    			append(div13, input11);
    			set_input_value(input11, /*user_info*/ ctx[0].phone);
    			append(div19, t54);
    			append(div19, p5);
    			append(div19, t56);
    			append(div19, div14);
    			append(div14, label13);
    			append(div14, t58);
    			append(div14, input12);
    			set_input_value(input12, /*user_info*/ ctx[0].owner_firstname);
    			append(div19, t59);
    			append(div19, div15);
    			append(div15, label14);
    			append(div15, t61);
    			append(div15, input13);
    			set_input_value(input13, /*user_info*/ ctx[0].owner_lastname);
    			append(div19, t62);
    			append(div19, div16);
    			append(div16, label15);
    			append(div16, t64);
    			append(div16, input14);
    			set_input_value(input14, /*user_info*/ ctx[0].card_number);
    			append(div19, t65);
    			append(div19, div17);
    			append(div17, label16);
    			append(div17, t67);
    			append(div17, input15);
    			set_input_value(input15, /*user_info*/ ctx[0].expiry_date);
    			append(div19, t68);
    			append(div19, div18);
    			append(div18, label17);
    			append(div18, t70);
    			append(div18, input16);
    			set_input_value(input16, /*user_info*/ ctx[0].cvv2);
    			append(div19, t71);
    			append(div19, button);

    			if (!mounted) {
    				dispose = [
    					listen(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen(input1, "keyup", /*keyup_handler*/ ctx[6]),
    					listen(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen(input2, "keyup", /*keyup_handler_1*/ ctx[8]),
    					listen(input3, "input", /*input3_input_handler*/ ctx[9]),
    					listen(input4, "input", /*input4_input_handler*/ ctx[10]),
    					listen(select, "change", /*select_change_handler*/ ctx[11]),
    					listen(input5, "input", /*input5_input_handler*/ ctx[12]),
    					listen(input6, "input", /*input6_input_handler*/ ctx[13]),
    					listen(input7, "input", /*input7_input_handler*/ ctx[14]),
    					listen(input8, "input", /*input8_input_handler*/ ctx[15]),
    					listen(input9, "input", /*input9_input_handler*/ ctx[16]),
    					listen(input10, "input", /*input10_input_handler*/ ctx[17]),
    					listen(input11, "input", /*input11_input_handler*/ ctx[18]),
    					listen(input12, "input", /*input12_input_handler*/ ctx[19]),
    					listen(input13, "input", /*input13_input_handler*/ ctx[20]),
    					listen(input14, "input", /*input14_input_handler*/ ctx[21]),
    					listen(input15, "input", /*input15_input_handler*/ ctx[22]),
    					listen(input16, "input", /*input16_input_handler*/ ctx[23]),
    					listen(button, "click", /*click_handler*/ ctx[24]),
    					listen(div20, "load", checkLog())
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*user_info*/ 1 && input0.value !== /*user_info*/ ctx[0].username) {
    				set_input_value(input0, /*user_info*/ ctx[0].username);
    			}

    			if (dirty & /*user_info*/ 1 && input1.value !== /*user_info*/ ctx[0].password) {
    				set_input_value(input1, /*user_info*/ ctx[0].password);
    			}

    			if (dirty & /*user_info*/ 1 && input2.value !== /*user_info*/ ctx[0].confirm) {
    				set_input_value(input2, /*user_info*/ ctx[0].confirm);
    			}

    			if (dirty & /*user_info*/ 1 && input3.value !== /*user_info*/ ctx[0].firstname) {
    				set_input_value(input3, /*user_info*/ ctx[0].firstname);
    			}

    			if (dirty & /*user_info*/ 1 && input4.value !== /*user_info*/ ctx[0].lastname) {
    				set_input_value(input4, /*user_info*/ ctx[0].lastname);
    			}

    			if (dirty & /*user_info*/ 1) {
    				select_option(select, /*user_info*/ ctx[0].age);
    			}

    			if (dirty & /*user_info*/ 1 && input5.value !== /*user_info*/ ctx[0].street) {
    				set_input_value(input5, /*user_info*/ ctx[0].street);
    			}

    			if (dirty & /*user_info*/ 1 && input6.value !== /*user_info*/ ctx[0].house_number) {
    				set_input_value(input6, /*user_info*/ ctx[0].house_number);
    			}

    			if (dirty & /*user_info*/ 1 && input7.value !== /*user_info*/ ctx[0].apartment_number) {
    				set_input_value(input7, /*user_info*/ ctx[0].apartment_number);
    			}

    			if (dirty & /*user_info*/ 1 && input8.value !== /*user_info*/ ctx[0].city) {
    				set_input_value(input8, /*user_info*/ ctx[0].city);
    			}

    			if (dirty & /*user_info*/ 1 && input9.value !== /*user_info*/ ctx[0].postcode) {
    				set_input_value(input9, /*user_info*/ ctx[0].postcode);
    			}

    			if (dirty & /*user_info*/ 1 && input10.value !== /*user_info*/ ctx[0].email) {
    				set_input_value(input10, /*user_info*/ ctx[0].email);
    			}

    			if (dirty & /*user_info*/ 1) {
    				set_input_value(input11, /*user_info*/ ctx[0].phone);
    			}

    			if (dirty & /*user_info*/ 1 && input12.value !== /*user_info*/ ctx[0].owner_firstname) {
    				set_input_value(input12, /*user_info*/ ctx[0].owner_firstname);
    			}

    			if (dirty & /*user_info*/ 1 && input13.value !== /*user_info*/ ctx[0].owner_lastname) {
    				set_input_value(input13, /*user_info*/ ctx[0].owner_lastname);
    			}

    			if (dirty & /*user_info*/ 1 && input14.value !== /*user_info*/ ctx[0].card_number) {
    				set_input_value(input14, /*user_info*/ ctx[0].card_number);
    			}

    			if (dirty & /*user_info*/ 1 && input15.value !== /*user_info*/ ctx[0].expiry_date) {
    				set_input_value(input15, /*user_info*/ ctx[0].expiry_date);
    			}

    			if (dirty & /*user_info*/ 1 && input16.value !== /*user_info*/ ctx[0].cvv2) {
    				set_input_value(input16, /*user_info*/ ctx[0].cvv2);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function lengthChech(password) {
    	if (password.length < 8) {
    		return false;
    	} else {
    		return true;
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let user_info = {
    			username: "",
    			password: "",
    			confirm: "",
    			firstname: "",
    			lastname: "",
    			age: "",
    			phone: "",
    			email: "",
    			street: "",
    			house_number: "",
    			apartment_number: "",
    			city: "",
    			postcode: "",
    			owner_firstname: "",
    			owner_lastname: "",
    			card_number: "",
    			expiry_date: "",
    			cvv2: ""
    		};

    	let passwords_match = false;

    	async function register() {
    		if (user_info.username && user_info.password && user_info.firstname && user_info.lastname && user_info.age && user_info.phone && user_info.email && user_info.street && user_info.house_number && user_info.city && user_info.postcode && user_info.owner_firstname && user_info.owner_lastname && user_info.card_number && user_info.expiry_date && user_info.cvv2) {
    			$$invalidate(0, user_info.password = md5(user_info.password), user_info);
    			$$invalidate(0, user_info.card_number = md5(user_info.card_number), user_info);
    			$$invalidate(0, user_info.cvv2 = md5(user_info.cvv2), user_info);
    			let data = new FormData();

    			Object.keys(user_info).forEach(key => {
    				data.append(key, JSON.parse(JSON.stringify(user_info[key])));
    				$$invalidate(0, user_info[key] = "", user_info);
    			});

    			const URL = "./backend/AddItem.php";

    			let res = await fetch(URL, {
    				method: "POST",
    				body: data,
    				mode: "no-cors"
    			});

    			res = await res.json();
    			console.log(res);
    		} else {
    			alert("Nie uzupełniłeś wszystkiego!");
    		}
    	}

    	let check = function () {
    		if (user_info.password !== "" && user_info.confirm === "") {
    			if (lengthChech(password.value)) {
    				document.getElementById("message").innerHTML = "";
    			} else {
    				document.getElementById("message").innerHTML = "Zakrótkie hasło, minimalna długość to 8 znaków";
    			}
    		} else {
    			if (user_info.password === user_info.confirm) {
    				if (lengthChech(user_info.password)) {
    					document.getElementById("message").innerHTML = "";
    					$$invalidate(1, passwords_match = true);
    				} else {
    					document.getElementById("message").innerHTML = "Zakrótkie hasło, minimalna długość to 8 znaków";
    					$$invalidate(1, passwords_match = false);
    				}
    			} else {
    				document.getElementById("message").innerHTML = "Różne hasła";
    				$$invalidate(1, passwords_match = false);
    			}
    		}
    	};

    	function input0_input_handler() {
    		user_info.username = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input1_input_handler() {
    		user_info.password = this.value;
    		$$invalidate(0, user_info);
    	}

    	const keyup_handler = () => {
    		check();
    	};

    	function input2_input_handler() {
    		user_info.confirm = this.value;
    		$$invalidate(0, user_info);
    	}

    	const keyup_handler_1 = () => {
    		check();
    	};

    	function input3_input_handler() {
    		user_info.firstname = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input4_input_handler() {
    		user_info.lastname = this.value;
    		$$invalidate(0, user_info);
    	}

    	function select_change_handler() {
    		user_info.age = select_value(this);
    		$$invalidate(0, user_info);
    	}

    	function input5_input_handler() {
    		user_info.street = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input6_input_handler() {
    		user_info.house_number = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input7_input_handler() {
    		user_info.apartment_number = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input8_input_handler() {
    		user_info.city = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input9_input_handler() {
    		user_info.postcode = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input10_input_handler() {
    		user_info.email = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input11_input_handler() {
    		user_info.phone = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input12_input_handler() {
    		user_info.owner_firstname = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input13_input_handler() {
    		user_info.owner_lastname = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input14_input_handler() {
    		user_info.card_number = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input15_input_handler() {
    		user_info.expiry_date = this.value;
    		$$invalidate(0, user_info);
    	}

    	function input16_input_handler() {
    		user_info.cvv2 = this.value;
    		$$invalidate(0, user_info);
    	}

    	const click_handler = () => {
    		if (passwords_match) {
    			register();
    		}
    	};

    	return [
    		user_info,
    		passwords_match,
    		register,
    		check,
    		input0_input_handler,
    		input1_input_handler,
    		keyup_handler,
    		input2_input_handler,
    		keyup_handler_1,
    		input3_input_handler,
    		input4_input_handler,
    		select_change_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input10_input_handler,
    		input11_input_handler,
    		input12_input_handler,
    		input13_input_handler,
    		input14_input_handler,
    		input15_input_handler,
    		input16_input_handler,
    		click_handler
    	];
    }

    class Register extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, {});
    	}
    }

    /* src/routes/Login.svelte generated by Svelte v3.42.4 */

    function create_fragment$1(ctx) {
    	let section;
    	let div4;
    	let div0;
    	let t3;
    	let div3;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let p1;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			section = element("section");
    			div4 = element("div");
    			div0 = element("div");

    			div0.innerHTML = `<h1 class="title-font font-medium text-3xl text-gray-900">Zaloguj się...</h1> 
            <p class="leading-relaxed mt-4">...i odjedź wymażonym samochodem.</p>`;

    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Nazwa użytkownika";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Hasło";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			p1 = element("p");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Zaloguj";
    			attr(div0, "class", "w-1/4 mb-10 pr-0 flex flex-col items-start");
    			attr(label0, "for", "username");
    			attr(label0, "class", "leading-7 text-sm text-gray-600");
    			attr(input0, "type", "text");
    			attr(input0, "id", "username");
    			attr(input0, "name", "username");
    			attr(input0, "placeholder", "jan_kowalski");
    			attr(input0, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(div1, "class", "relative mb-4");
    			attr(label1, "for", "password");
    			attr(label1, "class", "leading-7 text-sm text-gray-600");
    			attr(input1, "type", "password");
    			attr(input1, "id", "password");
    			attr(input1, "name", "password");
    			attr(input1, "placeholder", "12345678");
    			attr(input1, "class", "w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out");
    			attr(p1, "id", "message");
    			attr(p1, "class", "text-xs mt-3 text-red-600");
    			attr(div2, "class", "relative mb-4");
    			attr(button, "class", "text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg");
    			attr(div3, "class", "bg-gray-100 rounded-lg p-8 flex flex-col w-2/3 mt-10 md:mt-0 self-center");
    			attr(div4, "class", "container px-5 py-24 mx-auto flex flex-wrap flex-col items-center");
    			attr(section, "class", "text-gray-600 body-font");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div4);
    			append(div4, div0);
    			append(div4, t3);
    			append(div4, div3);
    			append(div3, div1);
    			append(div1, label0);
    			append(div1, t5);
    			append(div1, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append(div3, t6);
    			append(div3, div2);
    			append(div2, label1);
    			append(div2, t8);
    			append(div2, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append(div2, t9);
    			append(div2, p1);
    			append(div3, t10);
    			append(div3, button);

    			if (!mounted) {
    				dispose = [
    					listen(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen(button, "click", /*click_handler*/ ctx[5]),
    					listen(div4, "load", checkLog())
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let username, password;

    	async function login() {
    		if (username && password) {
    			$$invalidate(1, password = md5(password));
    			let data = new FormData();
    			data.append("username", JSON.parse(JSON.stringify(username)));
    			data.append("password", JSON.parse(JSON.stringify(password)));
    			$$invalidate(0, username = "");
    			$$invalidate(1, password = "");
    			const URL = "./backend/Login.php";

    			let res = await fetch(URL, {
    				method: "POST",
    				body: data,
    				mode: "no-cors"
    			});

    			res = await res.json();

    			if (res.msg === "successfully") {
    				window.location.reload();
    			} else {
    				document.getElementById("message").innerHTML = res.msg;
    			}
    		} else {
    			alert("Nie uzupełniłeś wszystkiego!");
    		}
    	}

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	const click_handler = () => {
    		login();
    	};

    	return [
    		username,
    		password,
    		login,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler
    	];
    }

    class Login extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.4 */

    function create_fragment(ctx) {
    	let tailwindcss;
    	let t0;
    	let header;
    	let t1;
    	let router;
    	let t2;
    	let footer;
    	let current;
    	tailwindcss = new Tailwindcss({});
    	header = new Header({});

    	router = new Router({
    			props: {
    				routes: {
    					"/": Home,
    					"/display": Display,
    					"/addData": AddItem,
    					"/test": Test,
    					"/register": Register,
    					"/login": Login,
    					"*": NotFound
    				}
    			}
    		});

    	footer = new Footer({});

    	return {
    		c() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(router.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(router, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach(t1);
    			destroy_component(router, detaching);
    			if (detaching) detach(t2);
    			destroy_component(footer, detaching);
    		}
    	};
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
