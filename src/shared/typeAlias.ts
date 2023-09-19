import { ApexOptions } from 'apexcharts';
import { ComponentWithAs, IconProps } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { ExternalProgram } from '../models/ExternalProgram';
import { InternalProgram } from '../models/InternalProgram';

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
export type SVGComponent = ComponentWithAs<"svg", IconProps>
export type UUID = string
export type AnyProgram = InternalProgram | ExternalProgram
export type FilterPredicate<T> = (value: T, index: number, array: T[]) => unknown
export type ContextState = { loading: boolean, error: string | null }
export type ContextSetter<T> = Dispatch<SetStateAction<T>>
export type ApexChartData = { options: ApexOptions, series: ApexAxisChartSeries | ApexNonAxisChartSeries }