const ServiceProvider = {
    mappings: new Map(),
    instance: function (name: string): any {
        const resolver = this.resolve(name);

        return resolver();
    },
    singleton: function (name: string): any {
        const resolver = this.resolve(name);

        let value = resolver;
        if (typeof resolver === 'function') {
            value = resolver();
            this.mappings.set(name, value);
        }

        return value;
    },
    register: function(name: string, resolver: Function): void {
        this.mappings.set(name, resolver);
    },
    resolve: function (name: string): any {
        const resolver = this.mappings.get(name);
        if (!resolver) {
            throw new Error(`Undefined service ${name}`);
        }

        return resolver;
    }
};

export default ServiceProvider;
