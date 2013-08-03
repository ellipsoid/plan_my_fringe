class VenuesController < ApplicationController
  before_action :set_venue, only: [:show, :edit, :update, :destroy]

  # GET /venues
  def index
    @venues = Venue.all
  end

  # GET /venues/1
  def show
  end

  # GET /venues/new
  def new
    @venue = Venue.new
  end

  # GET /venues/1/edit
  def edit
  end

  # POST /venues
  def create
    @venue = Venue.new(venue_params)

    if @venue.save
      redirect_to @venue, notice: 'Venue was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /venues/1
  def update
    if @venue.update(venue_params)
      redirect_to @venue, notice: 'Venue was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /venues/1
  def destroy
    @venue.destroy
    redirect_to venues_url, notice: 'Venue was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_venue
      @venue = Venue.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def venue_params
      params.require(:venue).permit(:name)
    end
end
