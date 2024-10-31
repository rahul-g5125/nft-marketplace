
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";

actor class NFT(name: Text, principal: Principal, content: [Nat8]) = this{
    private let itemName = name;
    private var nftOwner = principal;
    private let imageBytes = content;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner(): async Principal {
        return nftOwner;
    };

    public query func getImage(): async [Nat8]{
        return imageBytes;
    };

    public query func getCanisterId(): async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnerShip(newOwner: Principal): async Text {
        if(msg.caller == nftOwner){
            nftOwner := newOwner;
        } 
        else {
            return "Error: Not initiated by NFT Owner";
        };
        return "Success";
    };
}