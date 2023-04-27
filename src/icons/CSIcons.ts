import {
    buildingIcon,
    calendarIcon,
    chartIcon,
    checkIcon,
    deleteUserIcon,
    galleryIcon,
    leftArrowIcon,
    nextIcon,
    previousIcon,
    puzzleIcon,
    refreshIcon,
    searchUserIcon,
    teacherIcon,
    usersIcon
} from './icon-src';
import { createIcon } from '@chakra-ui/react';

export const CSUsers = createIcon({
    displayName: "CSUsers",
    viewBox: "0 0 35 35",
    path: usersIcon
})

export const CSBuilding = createIcon({
    displayName: "CSBuilding",
    viewBox: "0 0 35 35",
    path: buildingIcon
})

export const CSTeacher = createIcon({
    displayName: "CSTeacher",
    viewBox: "0 0 35 35",
    path: teacherIcon
})

export const CSGallery = createIcon({
    displayName: "CSGallery",
    viewBox: "0 0 35 35",
    path: galleryIcon
})

export const CSCalendar = createIcon({
    displayName: "CSCalendar",
    viewBox: "0 0 35 35",
    path: calendarIcon
})

export const CSChart = createIcon({
    displayName: "CSChart",
    viewBox: "0 0 35 35",
    path: chartIcon
})

export const CSSearchUser = createIcon({
    displayName: "CSSearchUser",
    viewBox: "0 0 25 25",
    path: searchUserIcon
})

export const CSDeleteUser = createIcon({
    displayName: "CSDeleteUser",
    viewBox: "0 0 28 35",
    path: deleteUserIcon
})

export const CSRefreshIcon = createIcon({
    displayName: "CSRefreshIcon",
    viewBox: "0 0 32 32",
    path: refreshIcon
})

export const CSPreviousIcon = createIcon({
    displayName: "CSPreviousIcon",
    viewBox: "0 0 32 32",
    path: previousIcon
})

export const CSNextIcon = createIcon({
    displayName: "CSNextIcon",
    viewBox: "0 0 32 32",
    path: nextIcon
})

export const CSCheckIcon = createIcon({
    displayName: "CSCheckIcon",
    viewBox: "0 0 22 22",
    path: checkIcon
})

export const CSLeftArrowIcon = createIcon({
    displayName: "CSLeftArrowIcon",
    viewBox: "0 0 24 24",
    path: leftArrowIcon
})

export const CSPuzzleIcon = createIcon({
    displayName: "CSPuzzleIcon",
    path: puzzleIcon,
    viewBox: "0 0 24 24"
})