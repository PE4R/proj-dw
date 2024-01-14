import PropTypes from 'prop-types'

function Card(props){
    return(
        <div className='card'>
            <img className='card-image' src={props.src} alt={props.alt} />
            <h3 className='card-title'>{props.name}</h3>
            <p className='card-text'>{props.description}</p>
        </div>
    )
}

Card.propTypes = {
    name: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string,
    description: PropTypes.string,
}

Card.defaultProps = {
    name: "default name",
    src: "https://images.adsttc.com/media/images/5b3b/6d3a/f197/cc2d/c700/0064/large_jpg/a-132.jpg",
    alt: "default image",
    description: "description",
}

export default Card