import { useState, useEffect } from 'react';
import Zeroconf from 'react-native-zeroconf';

const useRaspberryPiIP = () => {
    const [raspberryIp, setRaspberryIp] = useState(null);

    useEffect(() => {
        console.log("Zeroconf :", Zeroconf);
        const zeroconf = new Zeroconf();
    
        if (!zeroconf) {
            console.error("Zeroconf est null !");
            return;
        }
    
        zeroconf.scan('http', 'tcp', 'local.');
    
        zeroconf.on('resolved', (service) => {
            console.log("Service trouvé :", service);
            setRaspberryIp(service.addresses[0]);
        });
    
        return () => {
            zeroconf.stop();
        };
    }, []);
    

    return raspberryIp;
};

export default useRaspberryPiIP;
