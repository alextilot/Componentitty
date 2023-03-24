import './style.scss'

const NavigationItem = (props) => {
  return (<>
    <a href={props.url}>
      <img srv={props.img} alt={props.name}></img>
      <span>{props.name}</span>
    </a>
  </>
  )
}

const VisualNavigation = (props) => {
  const [expanded, setExpanded] = React.useEffect(false);
  return (
    <>
      <h1>Hello React</h1>;
      <div className="Comment">
        <div className="UserInfo">
          <img className="Avatar"
            src={props.author.avatarUrl}
            alt={props.author.name} />
          <div className="UserInfo-name">
            {props.author.name}
          </div>
        </div>
        <div className="Comment-text">
          {props.text}
        </div>
        <div className="Comment-date">
          {formatDate(props.date)}
        </div>
      </div>
    </>
  );
}
const visualNavItems = [
  {
    name: 'Tops',
    url: '/shop/womens-swimsuit-tops-swimsuits/S-xfh-xez-y5c-xhd-xec?cm_re=lec-_-wms-_-idx-_-visnav-1-16-_-wms-swimsuits-_-swimtops-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/tops.webp'
  },
  {
    name: 'Bottoms',
    url: '/shop/womens-swimsuit-bottoms-swimsuits/S-xfh-xez-y5c-xhe-xec?cm_re=lec-_-wms-_-idx-_-visnav-2-16-_-wms-swimsuits-_-swimbottoms-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/bottoms.webp',
  },
  {
    name: 'One Pieces',
    url: '/shop/womens-one-piece-swimsuits/S-xfh-xez-y5c-xhc-xec?cm_re=lec-_-wms-_-idx-_-visnav-3-16-_-wms-swimsuits-_-onepiece-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/one-pieces.webp',
  },
  {
    name: '14W-26W',
    url: '/shop/plus-size-swimwear-swimsuits/S-xfh-xez-y5c-yp2-xec?cm_re=lec-_-wms-_-idx-_-visnav-4-16-_-wms-swimsuits-_-plus-swim-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/14w-26w.webp',
  },
  {
    name: 'Tankini Tops',
    url: '/shop/womens-tankini-tops-swimsuit-swimsuits/S-xfh-xez-y5c-xhd-y9j-xec?cm_re=lec-_-wms-_-idx-_-visnav-5-16-_-wms-swimsuits-_-tankinis-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/tankini-tops.webp',
  },
  {
    name: 'Swim Shorts',
    url: '/shop/womens-swim-shorts-leggings-swimsuit-bottoms-swimsuits/S-xfh-xez-y5c-xhe-y9k-xec?cm_re=lec-_-wms-_-idx-_-visnav-6-16-_-wms-swimsuits-_-swimshorts-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/swim-shorts.webp',
  },
  {
    name: 'Cover Ups',
    url: '/shop/womens-swimsuit-cover-ups-swimsuits/S-xfh-xez-y5c-xhf-xec?cm_re=lec-_-wms-_-idx-_-visnav-7-16-_-wms-swimsuits-_-cover-ups-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/cover-ups.webp',
  },
  {
    name: 'Rash Guards',
    url: '/shop/womens-rash-guards-swimsuits/S-xfh-xez-y5c-xhg-xec?cm_re=lec-_-wms-_-idx-_-visnav-8-16-_-wms-swimsuits-_-rash-guards-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/rash-guards.webp',
  },
  {
    name: 'Long Torso',
    url: '/shop/womens-tall-swimsuits/S-xfh-xez-y5c-yox-yoq-xec?cm_re=lec-_-wms-_-idx-_-visnav-9-16-_-wms-swimsuits-_-longtorso-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/long-torso-swimsuits.webp',
  },
  {
    name: 'Cup Sizes D-G',
    url: '/shop/womens-d-cup-dd-cup-ddd-cup-g-swimsuits/S-xfh-y0q-y0r-y0s-y0y-xez-y5c-xec?cm_re=lec-_-wms-_-idx-_-visnav-10-16-_-wms-swimsuits-_-extended-cup-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/cup-sizes-d-g.webp',
  },
  {
    name: 'Petite',
    url: '/shop/womens-petite-swimsuits/S-xfh-xez-y5c-yov-xec?cm_re=lec-_-wms-_-idx-_-visnav-11-16-_-wms-swimsuits-_-petiteswim-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/petite.webp',
  },
  {
    name: 'Underwire Bras',
    url: '/shop/womens-underwire-swimsuits/S-xfh-xez-y5c-y9e-xec?cm_re=lec-_-wms-_-idx-_-visnav-12-16-_-wms-swimsuits-_-underwireswim-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/underwire-bras.webp',
  },
  {
    name: 'Tummy Control',
    url: '/shop/womens-flatten-tummy-full-body-slimming-swimsuits/S-xfh-xez-y5c-xqh-xqk-xec?cm_re=lec-_-wms-_-idx-_-visnav-13-16-_-wms-swimsuits-_-tummycontrol-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/tummy-control.webp',
  },
  {
    name: 'Bust Minimizing',
    url: '/shop/womens-minimize-bust-swimsuits/S-xfh-xez-y5c-xqf-xec?cm_re=lec-_-wms-_-idx-_-visnav-14-16-_-wms-swimsuits-_-bustminimizing-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/bust-minimizing.webp',
  },
  {
    name: 'Thigh Coverage',
    url: '/shop/womens-conceal-thighs-swimsuits/S-xfh-xez-y5c-xqj-xec?cm_re=lec-_-wms-_-idx-_-visnav-15-16-_-wms-swimsuits-_-thighcoverage-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/thigh-coverage.webp',
  },
  {
    name: 'Tummy Camouflage:',
    url: '/shop/womens-camouflaging-swimsuits/S-xfh-xez-y5c-xqn-xec?cm_re=lec-_-wms-_-idx-_-visnav-16-16-_-wms-swimsuits-_-camouflaging-_-extendnavtest-_-20230322-_-img',
    image: 'https://www.landsend.com/adobe-target/visual-nav/swim/tummy-camouflage.webp',
  },
]
export function App() {
  return (<VisualNavigation items={visualNavItems} />)
}