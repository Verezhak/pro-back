import { contactTypeList } from "../constants/index.js";

const parseBoolean = value => {
    if (typeof value !== "string") return;
    if (!["true", "false"].includes(value)) return;
    const parsedValue = Boolean(value);
    return parsedValue;
};

const parseContactFilterParams = ({ contactType, isFavorite }) => {
    const parsedContactType = contactTypeList.includes(contactType) ? contactType : null;
    const parsedIsFavorite = parseBoolean(isFavorite);
    return {
        contactType: parsedContactType,
        isFavorite: parsedIsFavorite,
    };
};

export default parseContactFilterParams;