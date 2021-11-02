import { IObservable } from './IObservable';

export interface ITransformedObservable<K> extends IObservable<K> {};

export interface ITransformedReadOnlyObservable<K> extends IObservable<K> {};
