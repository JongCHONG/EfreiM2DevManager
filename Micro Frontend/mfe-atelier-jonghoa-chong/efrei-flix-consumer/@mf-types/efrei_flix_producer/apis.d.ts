
    export type RemoteKeys = 'efrei_flix_producer/button';
    type PackageType<T> = T extends 'efrei_flix_producer/button' ? typeof import('efrei_flix_producer/button') :any;