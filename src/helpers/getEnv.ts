function getEnv(): string {
    return process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
}

export default getEnv;
