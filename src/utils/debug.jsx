export default function debug(msg, force=false) {
    if (DEBUG||force) console.warn(msg);
}
export function doIfDebug(f, force=false) {
    if (DEBUG||force) f();
}

const DEBUG=/*false;/*/("production" !== process.env.NODE_ENV);/**/