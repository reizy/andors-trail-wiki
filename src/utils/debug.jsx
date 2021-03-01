export default function debug(msg) {
    //if (DEBUG) 
        console.log(msg);
}
export function doIfDebug(f) {
    if (DEBUG) f();
}

const DEBUG=false;//("production" !== process.env.NODE_ENV);