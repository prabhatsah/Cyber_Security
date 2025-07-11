class DomNodeRemoval {
    private domeNodeRemovalFunctions: Record<string, Array<Function>> = {};
    public registerDomNodeRemovalFunction(nodeName: string, removalFunction: Function) {
        var existingFunctions: Array<Function> | undefined = this.domeNodeRemovalFunctions[nodeName];
        if (existingFunctions == undefined) {
            existingFunctions = [];
        }
        if (existingFunctions.indexOf(removalFunction) == -1) {
            existingFunctions.push(removalFunction);
        }
        this.domeNodeRemovalFunctions[nodeName] = existingFunctions;
    }

    public domNodeRemoved(objEvent: Event) {
        let id: string | undefined = (objEvent.target as HTMLElement)?.id;
        let removalFunctions: Array<Function> | undefined = this.domeNodeRemovalFunctions[id];
        if (removalFunctions) {
            removalFunctions.forEach(fn => {
                fn(id);
            });
            delete this.domeNodeRemovalFunctions[id];
        } else {
            let target: HTMLElement = objEvent.target as HTMLElement;
            Object.keys(this.domeNodeRemovalFunctions).forEach(
                function (item) {
                    var has = target.querySelectorAll("#" + item).length;
                    if (has) {
                        var removalFunctions = IkonDomNodeRemoval.getDomNodeRemovalFunctions()[item];
                        if (removalFunctions) {
                            removalFunctions.forEach(fn => {
                                fn(item);
                            });
                        }
                        IkonDomNodeRemoval.deleteDomNodeRemovalFunctionsForNode(item);
                    }
                }
            );
        }
    }

    public deleteDomNodeRemovalFunctionsForNode(nodeName: string) {
        delete this.domeNodeRemovalFunctions[nodeName];
    }

    public getDomNodeRemovalFunctions(): Record<string, Array<Function>> {
        return this.domeNodeRemovalFunctions;
    }
}

const IkonDomNodeRemoval = new DomNodeRemoval();

export { IkonDomNodeRemoval };