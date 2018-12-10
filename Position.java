

public class Position {
    private boolean northLat;
    private double degreeLat;
    private double minuteLat;
    private double secondLat;
    private boolean westLong;
    private double degreeLong;
    private double minuteLong;
    private double secondLong;

    /**
     * gets the distance between to points.
     * @param p1 The position of the first point.
     * @param p2 The position of the second point.
     * @return the distance in meters between the two.
     */
    public static double distance(Position p1, Position p2){
        // https://www.movable-type.co.uk/scripts/latlong.html
        double rearth = 6371000.0;
        double lat1 = Math.toRadians(p1.getLatitude());
        double lat2 = Math.toRadians(p2.getLatitude());
        double deltaLat = (lat2-lat1);
        double deltaLong = Math.toRadians(p2.getLongitude()-p1.getLongitude());

        double haversine = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) 
            * Math.pow(Math.sin(deltaLong/2), 2);

        double c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1-haversine));

        System.out.println(haversine);

        return rearth * c;
    }

    public Position(){}

    public Position(boolean northLat, double degreeLat, double minuteLat, double secondLat, boolean westLong, 
            double degreeLong, double minuteLong, double secondLong){
        this.northLat = northLat;
        this.degreeLat = degreeLat;
        this.minuteLat = minuteLat;
        this.secondLat = secondLat;
        this.westLong = westLong;
        this.degreeLong = degreeLong;
        this.minuteLong = minuteLong;
        this.secondLong = secondLong;
    }

    public void setNorthLatitude(boolean northLat){
        this.northLat = northLat;
    }

    public void setDegreeLatitude(double degreeLat){
        this.degreeLat = degreeLat;
    }

    public void setMinuteLatitude(double minuteLat){
        this.minuteLat = minuteLat;
    }

    public void setSecondLatitude(double secondLat){
        this.secondLat = secondLat;
    }

    public void setWestLongitude(boolean westLong){
        this.westLong = westLong;
    }

    public void setDegreeLongitude(double degreeLong){
        this.degreeLong = degreeLong;
    }

    public void setMinuteLongitude(double minuteLong){
        this.minuteLong = minuteLong;
    }

    public void setSecondLongitude(double secondLong){
        this.secondLong = secondLong;
    }

    public boolean isNorthLatitude(){
        return northLat;
    }

    public double getDegreeLatitude(){
        return degreeLat;
    }

    public double getMinuteLatitude(){
        return minuteLat;
    }

    public double getSecondLatitude(){
        return secondLat;
    }

    public boolean isWestLongitude(){
        return westLong;
    }

    public double getDegreeLongitude(){
        return degreeLong;
    }

    public double getMinuteLongitude(){
        return minuteLong;
    }

    public double getSecondLongitude(){
        return secondLong;
    }

    // dms to decimal
    // https://www.rapidtables.com/convert/number/degrees-minutes-seconds-to-degrees.html

    public double getLatitude(){
        return degreeLat+(minuteLat/60)+(secondLat/3600);
    }

    public double getLongitude(){
        return degreeLong+(minuteLong/60)+(secondLong/3600);
    }

    public static void main(String[] args){
        Position p1 = new Position(true, 40, 46, 19.00, true, 73, 15, 19.00);
        Position p2 = new Position(true, 40, 15, 29.016, true, 74, 31, 33.312);
        System.out.println("Distance: " + Position.distance(p1, p2));
    }

}