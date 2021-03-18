export class ResponseCheck {

    static anomalyDetech(x: ISimplifiedResponse): boolean {

        if (x.statusCode >= 200 && x.statusCode < 300) {
            return false;
        }

        return true;
    }

}