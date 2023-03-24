import "./component.style.scss";
import { NAV_ITEMS } from "./navItems"

const useState = React.useState;
const useEffect = React.useEffect;


const NavigationItem = (props) => {
  return (
    <div className="VisualNavigation__Item col-3">
      <a className="VisualNavigation__Item__Link" href={props.url}>
        <div className="VisualNavigation__Item__Image">
          <img className="img-responsive" src={props.image} alt={props.name}></img>
        </div>
        <div className="VisualNavigation__Item__Text">{props.name}</div>
      </a>
    </div>
  );
};

const NavContainer = ({ isExpanded, items }) => {
  return (
    <div className={`VisualNavigation__Container${isExpanded ? "--full" : "--half"} container`}>
      <div className="row">
        {items.map((component) => (
          <NavigationItem
            url={component.url}
            image={component.image}
            name={component.name}
          ></NavigationItem>
        ))}
      </div>
    </div>
  );
};

const VisualNavigation = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src;
        img.onLoad = resolve();
        img.onerror = reject();
      })
    })
    await Promise.all(promises);
    setIsLoading(false);
  }

  useEffect(() => {
    const images = NAV_ITEMS.map(element => element.image);
    cacheImages(images);
  }, [])


  const half = Math.ceil(NAV_ITEMS.length / 2);
  const firstHalf = NAV_ITEMS.slice(0, half);
  const secondHalf = NAV_ITEMS.slice(half);

  const navItems = expanded ? NAV_ITEMS : firstHalf;
  const buttonText = expanded
    ? "- Show Less Filters"
    : `+ Show More Filters (${secondHalf.length})`;

  return (
    <div className="VisualNavigation">
      <h4>Women's Swimsuits</h4>
      <NavContainer isExpanded={expanded} items={navItems} />
      <div className="VisualNavigation__Button">
        <button
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {buttonText}
        </button>
      </div>
      <hr class="d-block"></hr>
    </div>
  );
};

export const App = () => {
  return <VisualNavigation />;
};
