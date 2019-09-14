pragma solidity ^0.5.11;


    
contract Bank
{
    uint256 public hotelscount = 0;
    mapping(uint256 => data ) public hotels;
    
    struct data
    {
        int     oyoid;   
        string  review;
    }
    
    function addReview(int id, string memory _review) public {
        hotelscount += 1;
        hotels[hotelscount] = data(id, _review);
    }
    
    function returnReview(int id) public view returns(string memory)  
    {
        for (uint i=0; i<=hotelscount; i++)
        {   
            if (hotels[i].oyoid == id)
            {
                return hotels[hotelscount].review ;
            }
        }    
    }
    
 


}
