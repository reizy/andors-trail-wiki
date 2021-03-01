import { Link } from 'react-router-dom';

export default function LiLink(prefix, next, path, label=next) {
    const to = prefix+next;
    const liClass = (path.toUpperCase()==to.toUpperCase())?"selected":""; 
    return  <li className={liClass} key={next}><Link to={to.toLowerCase()}>{label.capitalize()}</Link></li>
}