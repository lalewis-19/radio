public class RadioStation {

    private double freq;
    private String callsign;
    private String city;
    private String state;
    private String country;
    private double powerHorz, powerVert; // kW
    private double haat; // antena height above average terrain
    private Position pos;
    private String company;

    
    private double signalStrength;

    public RadioStation(){}

    public void setFrequency(double freq){
        this.freq = freq;
    }

    public void setCallSign(String callsign){
        this.callsign = callsign;
    }

    public void setCity(String city){
        this.city = city;
    }

    public void setState(String state){
        this.state = state;
    }

    public void setCountry(String country){
        this.country = country;
    }

    public void setHorizontalPower(double powerHorz){
        this.powerHorz = powerHorz;
    }

    public void setVerticalPower(double powerVert){
        this.powerVert = powerVert;
    }

    public void setHAAT(double haat){
        this.haat = haat;
    }

    public void setPosition(Position pos){
        this.pos = pos;
    }

    public void setCompany(String company){
        this.company = company;
    }

    public double getFrequency(){
        return freq;
    }

    public double getCallSign(){
        return callsign;
    }

    public double getCity(){
        return city;
    }

    public String getState(){
        return state;
    }

    public String getCountry(){
        return country;
    }

    public double getHorizontalPower(){
        return powerHorz;
    }

    public double getVerticalPower(){
        return powerVert;
    }

    public double getHAAT(){
        return haat;
    }

    public Position getPosition(){
        return pos;
    }

    public String getCompany(){
        return company;
    }
    
}