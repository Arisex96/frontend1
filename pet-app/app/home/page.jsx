"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageIcon, UploadIcon } from "lucide-react";

export default function Home() {
  const [error, setError] = useState("");
  const [registerImage, setRegisterImage] = useState(null);
  const [registerPreview, setRegisterPreview] = useState(null);
  const [searchImage, setSearchImage] = useState(null);
  const [searchPreview, setSearchPreview] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [animalId, setAnimalId] = useState("");

  // Handle image preview for registration
  const handleRegisterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
      setRegisterImage(file);
      setRegisterPreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    }
  };

  // Handle image preview for search
  const handleSearchImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSearchImage(file);
      setSearchPreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    }
  };

  // Register animal
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!registerImage) {
      setError("Please select an image to register.");
      return;
    }

    console.log(registerImage); // Log the file object

    const formData = new FormData();
    formData.append("image", registerImage); // Ensure this is correct

    try {
      const response = await axios.post("https://git-app-backend.onrender.com/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnimalId(response.data.animal_id);
      alert(`Animal registered successfully! ID: ${response.data.animal_id}`);
      setRegisterImage(null);
      setRegisterPreview(null);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error registering animal: ${error.response.data.error || "Unknown error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an error
        setError(`Error: ${error.message}`);
      }
      console.error(error);
    }
  };

  // Search animal
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!searchImage) {
      setError("Please select an image to search.");
      return;
    }

    const formData = new FormData();
    formData.append("image", searchImage);

    try {
      const response = await axios.post("https://git-app-backend.onrender.com/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSearchResults(response.data.matches);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error searching for animal: ${error.response.data.error || "Unknown error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from the server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an error
        setError(`Error: ${error.message}`);
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">Animal Face ID System</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Register Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Register New Animal</CardTitle>
            <CardDescription>Upload an image to register a new animal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-image" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </Label>
                <Input
                  id="register-image"
                  type="file"
                  accept="image/*"
                  onChange={handleRegisterImageChange}
                  className="w-full"
                  required
                />
              </div>
              {registerPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img
                    src={registerPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <UploadIcon className="mr-2 h-4 w-4" />
                Register Animal
              </Button>
            </form>
          </CardContent>
          {animalId && (
            <CardFooter className="text-center">
              <p className="text-green-700 font-semibold">Registered Animal ID: {animalId}</p>
            </CardFooter>
          )}
        </Card>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Search Animal</CardTitle>
            <CardDescription>Upload an image to search for a registered animal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="search-image" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </Label>
                <Input
                  id="search-image"
                  type="file"
                  accept="image/*"
                  onChange={handleSearchImageChange}
                  className="w-full"
                  required
                />
              </div>
              {searchPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img
                    src={searchPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <ImageIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <CardFooter className="mt-6">
              <div className="w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h3>
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-green-700 font-semibold">
                          Animal ID: {result.animal_id}
                        </CardTitle>
                        <CardDescription>
                          Similarity: {(result.similarity * 100).toFixed(2)}%
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Registered At: {new Date(result.registered_at).toLocaleString()}
                        </p>
                        {result.image_url && (
                          <img
                            src={result.image_url}
                            alt="Animal"
                            className="w-32 h-32 object-cover rounded-lg mt-2"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}