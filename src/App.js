import React, { useState, useCallback, useEffect } from 'react';
import Searchbar from './Components/Searchbar';
import API from './Services/API';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import Modal from './Components/Modal';
import Button from './Components/Button';
import Loader from 'react-loader-spinner';
import './App.css';

export default function App() {
    const [main, setMain] = useState({
        images: [],
        searchQuery: '',
        currentPage: 1,
    });

    // eslint-disable-next-line no-unused-vars
    const [_, setError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [modal, setModal] = useState({
        modalImage: '',
        showModal: false,
    });

    const { images, searchQuery, currentPage } = main;

    const { modalImage, showModal } = modal;

    const toggleModal = largeImageURL => {
        setModal(prevState => ({
            ...prevState,
            modalImage: !showModal ? largeImageURL : '',
            showModal: !showModal,
        }));
    };

    const onChangeQuery = query => {
        setMain(prevState => ({
            ...prevState,
            images: [],
            searchQuery: query,
            currentPage: 1,
        }));

        setError(null);
    };

    const fetchImages = () => {
        const options = { searchQuery, currentPage };
        setIsLoading(true);

        API.fetchImages(options)
            .then(images => {
                setMain(prevState => ({
                    ...prevState,
                    images: [prevState.images, ...images],
                    currentPage: prevState.currentPage + 1,
                }));
            })
            .catch(error => setError(error))
            .finally(() => setIsLoading(false));

        scrollImages();
    };

    //     componentDidUpdate(prevProps, prevState) {
    //     if (prevState.searchQuery !== this.state.searchQuery) {
    //         this.fetchImages();
    //     };
    // };

    useEffect(() => {
        fetchImages();
    });

    const scrollImages = () => {
        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
            });
        }, 500);
    };

    return (
        <div className="App">
            <Searchbar onSubmit={onChangeQuery} />
            <ImageGallery images={images} onClick={toggleModal} />
            {isLoading && (
                <Loader
                    className="loader"
                    color="#303f9f"
                    type="Circles"
                    height={80}
                    width={80}
                />
            )}
            {images.length !== 0 && <Button onClick={fetchImages} />}
            {showModal && (
                <Modal modalImage={modalImage} onClose={toggleModal} />
            )}
        </div>
    );
}
