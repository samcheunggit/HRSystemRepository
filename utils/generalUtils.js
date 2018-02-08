module.exports = {
    switchLeaveTypeColumn:(shortForm)=> {
        let result = '';
        
        switch(shortForm){
            case 'AL': result = 'annualleave'
                break;
            case 'SL': result = 'sickleave'
                break;
            case 'OTL': result = 'overtimeleave'
                break;
            case 'HL': result = 'healthleave'
                break;
            case 'ML': result = 'maternityleave'
                break;
            case 'MGL': result = 'marriageleave'
                break;
            case 'FL': result = 'funeralleave'
                break;
            case 'OL': result = 'otherleave'
                break;
            default: result = ''
                break;
        }
        
        return result;
    }
}