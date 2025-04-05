export const updateFavourites = (id, favourites) => {
    if (!Array.isArray(favourites)) return [id];
    return favourites.includes(id)
        ? favourites.filter((resId) => resId !== id)
        : [...favourites, id];
};

export const checkFavourites = (id, favourites) => {
    if (!Array.isArray(favourites)) return "white";
    return favourites?.includes(id) ? "#8ac243" : "white";
};

export const validateString = (value)=>{
    return  value?.length < 3 || value === null ? "Must have atleast  3 characters": null ;
};