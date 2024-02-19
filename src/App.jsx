import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import './index.css';
import { useState, useCallback, useEffect, useRef } from 'react';

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;


function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('');
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
      //Axios is used to make API call, await because axios returns a promise , whenever using await keyword always wrap that code in try catch so if the promise fails your application will not break
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.")
      console.log(error);
      setLoading(false);
    }
  }, [page]);


  useEffect(() => {
    fetchImages();
  }, [fetchImages]);


  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // console.log(searchInput.current.value);
    resetSearch();
  };

  const handleSelection = (input) => {
    searchInput.current.value = input;
    resetSearch();
  };

  return (
    <div className='container'>
      <h1 className="title">Image Search</h1>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type='search'
            placeholder='Type something to search...'
            className='search-input'
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('shoes')}>Shoes</div>
      </div>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <>
          <div className="images">
            {images.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className='image'
              />
            ))}
          </div>
          <div className="buttons">
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
