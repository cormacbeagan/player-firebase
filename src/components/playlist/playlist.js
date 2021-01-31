import './playlist.css'

function Playlist({ onClick }) {
    const handleClick = (e) => {
        e.preventDefault()
        onClick()
    }

    return (
        <div className='divPlaylistStyle'>
            <a
                href=''
                className='playlist-btn playlist-btn-white'
                onClick={handleClick}
            >
                ADD TO PLAYLIST
            </a>
        </div>
    )
}

export default Playlist
